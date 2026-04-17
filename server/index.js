/**
 * MOS-READY — Express Server
 * Serves the static frontend + payment API + Word launch
 */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use('/src', express.static(join(rootDir, 'src')));
app.use(express.static(join(rootDir, 'public')));

// ===== API Routes =====

// Payment initialization (Paystack)
app.post('/api/payment/initialize', async (req, res) => {
  const { email, amount } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ success: false, message: 'Email and amount required' });
  }

  // In production, use actual Paystack secret key
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
  const reference = 'MOS_' + randomUUID().substring(0, 8);

  if (!PAYSTACK_SECRET) {
    // No key configured — return demo response
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
        email,
        amount, // in kobo
        reference,
        currency: 'NGN',
        callback_url: `http://localhost:${PORT}/api/payment/callback`
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
    return res.status(500).json({ success: false, message: 'Payment service error' });
  }
});

// Payment verification
app.get('/api/payment/verify/:reference', async (req, res) => {
  const { reference } = req.params;
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

  if (!PAYSTACK_SECRET) {
    return res.json({ success: false, message: 'Payment gateway not configured' });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
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
    return res.status(500).json({ success: false, message: 'Verification error' });
  }
});

// Payment callback
app.get('/api/payment/callback', (req, res) => {
  // Redirect back to app after payment
  res.redirect('/#practice-exam');
});

// Launch Microsoft Word
app.post('/api/word/launch', (req, res) => {
  // Detect platform and launch Word
  const isWindows = process.platform === 'win32';

  if (isWindows) {
    exec('start winword', (error) => {
      if (error) {
        // Try alternative path
        exec('start "" "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE"', (err2) => {
          if (err2) {
            exec('start "" "C:\\Program Files (x86)\\Microsoft Office\\root\\Office16\\WINWORD.EXE"', (err3) => {
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
  res.json({ status: 'ok', app: 'MOS-READY', version: '1.0.0' });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(rootDir, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎯 MOS-READY Server running at http://localhost:${PORT}\n`);
});

export default app;
