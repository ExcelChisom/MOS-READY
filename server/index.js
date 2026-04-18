/**
 * MOS-READY — Express Server (Security Hardened)
 * Serves the static frontend + payment API + Word launch
 */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID, createHmac } from 'crypto';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== SECURITY MIDDLEWARE =====

// CORS — restrict to same origin in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGIN || false
    : true,
  credentials: true
}));

// Body parser with size limit (prevent large payload attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Security headers (CSP, X-Frame, HSTS, etc.)
app.use((req, res, next) => {
  // Content Security Policy
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.paystack.co https://cdnjs.cloudflare.com",
    "worker-src 'self' blob: https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://api.paystack.co",
    "frame-src https://checkout.paystack.com",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; '));

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS (production only)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
});

// Rate limiting (simple in-memory, per IP)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // max requests per window for API

function rateLimiter(maxReqs = RATE_LIMIT_MAX) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const key = `${ip}:${req.path}`;

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 1, start: now });
      return next();
    }

    const entry = rateLimitStore.get(key);
    if (now - entry.start > RATE_LIMIT_WINDOW) {
      rateLimitStore.set(key, { count: 1, start: now });
      return next();
    }

    entry.count++;
    if (entry.count > maxReqs) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait before trying again.'
      });
    }

    next();
  };
}

// Clean up rate limit store every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.start > RATE_LIMIT_WINDOW * 2) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Input sanitization helper
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>&"'`]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;',
    '"': '&quot;', "'": '&#x27;', '`': '&#x60;'
  }[c]));
}

// ===== STATIC FILES =====
app.use('/src', express.static(join(rootDir, 'src'), {
  maxAge: '1h',
  etag: true,
  lastModified: true
}));
app.use(express.static(join(rootDir, 'public'), {
  maxAge: '1h',
  etag: true,
  lastModified: true
}));

// ===== PAYMENT WEBHOOK SIGNATURE VERIFICATION =====
function verifyPaystackSignature(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;

  const hash = createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  return hash === req.headers['x-paystack-signature'];
}

// ===== API Routes =====

// Payment initialization (Paystack) — rate limited
app.post('/api/payment/initialize', rateLimiter(5), async (req, res) => {
  const { email, amount, type } = req.body;

  // Validate inputs
  if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ success: false, message: 'Valid email required' });
  }

  const validAmounts = [25000]; // Only allow ₦250 = 25000 kobo
  if (!validAmounts.includes(amount)) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  const validTypes = ['practice_exam', 'premium_games', undefined];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid payment type' });
  }

  const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
  const reference = 'MOS_' + randomUUID().substring(0, 8);

  if (!PAYSTACK_SECRET) {
    return res.json({
      success: false,
      message: 'Payment gateway not configured. Use demo mode.',
      reference
    });
  }

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: sanitizedEmail,
        amount,
        reference,
        currency: 'NGN',
        metadata: { type: type || 'practice_exam' },
        callback_url: `${process.env.APP_URL || 'http://localhost:' + PORT}/api/payment/callback`
      })
    });

    const data = await response.json();

    if (data.status) {
      return res.json({
        success: true,
        authorization_url: data.data.authorization_url,
        reference: data.data.reference
      });
    } else {
      return res.json({ success: false, message: data.message });
    }
  } catch (error) {
    console.error('Payment init error:', error.message);
    return res.status(500).json({ success: false, message: 'Payment service error' });
  }
});

// Payment verification — rate limited
app.get('/api/payment/verify/:reference', rateLimiter(10), async (req, res) => {
  const { reference } = req.params;

  // Validate reference format
  if (!reference || typeof reference !== 'string' || !reference.match(/^MOS_[a-f0-9]{8}$/i)) {
    return res.status(400).json({ success: false, message: 'Invalid reference' });
  }

  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

  if (!PAYSTACK_SECRET) {
    return res.json({ success: false, message: 'Payment gateway not configured' });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET}`
      }
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      return res.json({ success: true, reference });
    } else {
      return res.json({ success: false, message: 'Payment not confirmed' });
    }
  } catch (error) {
    console.error('Payment verify error:', error.message);
    return res.status(500).json({ success: false, message: 'Verification error' });
  }
});

// Paystack Webhook (server-to-server verification)
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!verifyPaystackSignature(req)) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const event = req.body;
  if (event.event === 'charge.success') {
    console.log('Payment successful:', event.data.reference);
    // In production: update database with payment status
  }

  res.status(200).json({ received: true });
});

// Payment callback
app.get('/api/payment/callback', (req, res) => {
  res.redirect('/#practice-exam');
});

// Launch Microsoft Word — rate limited
app.post('/api/word/launch', rateLimiter(5), (req, res) => {
  const isWindows = process.platform === 'win32';

  if (isWindows) {
    // Use safe exec with no shell injection possible (fixed command)
    exec('start winword', { timeout: 10000 }, (error) => {
      if (error) {
        exec('start "" "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE"', { timeout: 10000 }, (err2) => {
          if (err2) {
            exec('start "" "C:\\Program Files (x86)\\Microsoft Office\\root\\Office16\\WINWORD.EXE"', { timeout: 10000 }, (err3) => {
              if (err3) {
                return res.json({ success: false, message: 'Could not launch Word. Please open it manually.' });
              }
              return res.json({ success: true });
            });
          } else {
            return res.json({ success: true });
          }
        });
      } else {
        return res.json({ success: true });
      }
    });
  } else {
    return res.json({ success: false, message: 'Word launch only supported on Windows' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'MOS-READY', version: '2.0.0' });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(rootDir, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎯 MOS-READY Server running at http://localhost:${PORT}`);
  console.log(`🔒 Security: CSP, Rate Limiting, Input Sanitization enabled\n`);
});

export default app;
