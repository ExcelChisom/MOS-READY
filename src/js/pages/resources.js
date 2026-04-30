/**
 * MOS-READY — My Resources & AI Hub
 * Features:
 *   - Multi-note management (create, save, list, delete, switch)
 *   - File upload & AI question generation (.txt, .md, .pdf, .docx, .rtf)
 *   - Visual Mindmap generator (canvas-based)
 *   - Concept breakdown & YouTube references
 */
window.Resources = {
  notes: [],
  activeNoteId: null,

  // ==========================================
  // INITIALIZATION
  // ==========================================
  init() {
    this._loadNotes();
    this._renderNotesList();
    // Auto-load last active note
    if (this.notes.length > 0) {
      this._openNote(this.notes[0].id);
    }
  },

  // ==========================================
  // NOTES CRUD
  // ==========================================
  _loadNotes() {
    try {
      const raw = localStorage.getItem('mos_notes_v2');
      this.notes = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.notes = [];
    }
    // Migrate old single-note if exists
    if (this.notes.length === 0) {
      const legacy = localStorage.getItem('mos_saved_notes');
      if (legacy) {
        this.notes.push({
          id: Date.now(),
          title: 'My First Note',
          content: legacy,
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        });
        this._persistNotes();
        localStorage.removeItem('mos_saved_notes');
      }
    }
  },

  _persistNotes() {
    localStorage.setItem('mos_notes_v2', JSON.stringify(this.notes));
  },

  _renderNotesList() {
    const container = document.getElementById('resource-notes-list');
    if (!container) return;

    if (this.notes.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:30px; opacity:0.5">
          <div style="font-size:48px; margin-bottom:10px">📝</div>
          <p>No notes yet. Click "New Note" to start!</p>
        </div>`;
      return;
    }

    container.innerHTML = this.notes.map(n => `
      <div class="resource-note-item ${n.id === this.activeNoteId ? 'active' : ''}"
           onclick="Resources._openNote(${n.id})"
           style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px;
                  background:${n.id === this.activeNoteId ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.03)'};
                  border:1px solid ${n.id === this.activeNoteId ? 'var(--accent-purple)' : 'rgba(255,255,255,0.06)'};
                  border-radius:10px; cursor:pointer; transition:all 0.2s; margin-bottom:8px">
        <div style="min-width:0">
          <div style="font-weight:600; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${this._escapeHtml(n.title)}</div>
          <div style="font-size:11px; opacity:0.5; margin-top:2px">${new Date(n.updated).toLocaleDateString()} · ${n.content.length} chars</div>
        </div>
        <button onclick="event.stopPropagation(); Resources._deleteNote(${n.id})"
                style="background:none; border:none; color:#f72585; cursor:pointer; font-size:16px; padding:4px 8px; border-radius:6px; transition:background 0.2s"
                onmouseover="this.style.background='rgba(247,37,133,0.15)'" onmouseout="this.style.background='none'"
                title="Delete note">🗑️</button>
      </div>
    `).join('');
  },

  createNote() {
    const title = prompt('Note title:', `Study Note ${this.notes.length + 1}`);
    if (!title) return;

    const note = {
      id: Date.now(),
      title: title.trim(),
      content: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    this.notes.unshift(note);
    this._persistNotes();
    this._renderNotesList();
    this._openNote(note.id);
    if (window.Toast) Toast.success(`Created "${note.title}"`);
  },

  _openNote(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return;
    this.activeNoteId = id;

    const editor = document.getElementById('resource-notes');
    const titleEl = document.getElementById('resource-note-title');
    if (editor) editor.value = note.content;
    if (titleEl) titleEl.textContent = note.title;

    this._renderNotesList();
  },

  saveNotes() {
    const editor = document.getElementById('resource-notes');
    if (!editor) return;

    if (!this.activeNoteId) {
      // Auto-create if no active note
      this.createNote();
      return;
    }

    const note = this.notes.find(n => n.id === this.activeNoteId);
    if (!note) return;

    note.content = editor.value;
    note.updated = new Date().toISOString();
    this._persistNotes();
    this._renderNotesList();
    if (window.Toast) Toast.success('Notes saved!');
    if (window.Storage) Storage.addActivity({ type: 'other', text: `Saved note: ${note.title}` });
  },

  _deleteNote(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return;
    if (!confirm(`Delete "${note.title}"?`)) return;

    this.notes = this.notes.filter(n => n.id !== id);
    this._persistNotes();

    if (this.activeNoteId === id) {
      this.activeNoteId = null;
      const editor = document.getElementById('resource-notes');
      const titleEl = document.getElementById('resource-note-title');
      if (editor) editor.value = '';
      if (titleEl) titleEl.textContent = 'No note selected';
    }

    this._renderNotesList();
    if (window.Toast) Toast.info('Note deleted');
  },

  // ==========================================
  // FILE UPLOAD (multi-format)
  // ==========================================
  async _readFileAsText(file) {
    const name = file.name.toLowerCase();
    const type = file.type;

    // Plain text files (.txt, .md, .csv)
    if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.csv') ||
        type.startsWith('text/')) {
      return await file.text();
    }

    // RTF — strip RTF control codes and extract plain text
    if (name.endsWith('.rtf') || type === 'application/rtf') {
      const raw = await file.text();
      // Strip RTF formatting to extract plain text
      let cleaned = raw.replace(/\{\\[^{}]*\}/g, '');
      cleaned = cleaned.replace(/\\[a-z]+[-]?\d*\s?/gi, '');
      cleaned = cleaned.replace(/[{}\\]/g, '');
      return cleaned.trim();
    }

    // DOCX — it's a ZIP; extract word/document.xml and strip XML tags
    if (name.endsWith('.docx') || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'application/zip' });
        // Use the browser's native zip support if available, otherwise parse manually
        const text = await this._extractDocxText(arrayBuffer);
        return text;
      } catch (e) {
        console.warn('DOCX parse failed, falling back to raw text extraction:', e);
        const raw = await file.text();
        return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    // PDF — extract visible text from the raw stream
    if (name.endsWith('.pdf') || type === 'application/pdf') {
      try {
        const raw = await file.text();
        // Extract text between BT...ET blocks (PDF text objects)
        const textBlocks = [];
        const btRegex = /BT\s*([\s\S]*?)ET/g;
        let match;
        while ((match = btRegex.exec(raw)) !== null) {
          const block = match[1];
          // Extract strings within parentheses: (text)
          const strRegex = /\(([^)]*)\)/g;
          let strMatch;
          while ((strMatch = strRegex.exec(block)) !== null) {
            textBlocks.push(strMatch[1]);
          }
        }
        if (textBlocks.length > 0) {
          return textBlocks.join(' ').replace(/\s+/g, ' ').trim();
        }
        // Fallback: grab anything that looks like readable text
        return raw.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').substring(0, 10000).trim();
      } catch (e) {
        return '(Could not extract PDF text. Try a .txt or .docx file instead.)';
      }
    }

    // DOC (legacy binary) — best-effort
    if (name.endsWith('.doc')) {
      const raw = await file.text();
      return raw.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // Fallback
    return await file.text();
  },

  async _extractDocxText(arrayBuffer) {
    // DOCX is a ZIP containing XML. We manually find word/document.xml
    const bytes = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8');
    const fullText = decoder.decode(bytes);

    // Find the document.xml content within the zip
    // Look for <w:t> tags which contain the actual text
    const textParts = [];
    const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
    while ((match = wtRegex.exec(fullText)) !== null) {
      textParts.push(match[1]);
    }

    if (textParts.length > 0) {
      return textParts.join(' ');
    }

    // Fallback: strip all XML and get readable chars
    return fullText.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
  },

  async processFile() {
    const fileInput = document.getElementById('resource-file-upload');
    const amountInput = document.getElementById('resource-q-amount');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      if (window.Toast) Toast.error('Please upload a file first!');
      return;
    }

    const file = fileInput.files[0];
    const amount = parseInt(amountInput?.value) || 5;

    if (window.Toast) Toast.info(`Analyzing "${file.name}"...`);

    let text;
    try {
      text = await this._readFileAsText(file);
    } catch (e) {
      if (window.Toast) Toast.error('Could not read that file. Try .txt or .md.');
      return;
    }

    if (!text || text.trim().length < 20) {
      if (window.Toast) Toast.error('File appears empty or unreadable. Try a different format.');
      return;
    }

    this._analyzeText(text, amount);
  },

  _analyzeText(text, amount) {
    const sentences = text.split(/[.?!\n]/).filter(s => s.trim().length > 10);
    const words = text.split(/\s+/);

    // MOS-specific keyword extraction
    const mosTerms = [
      'Ribbon', 'Layout', 'Margin', 'Font', 'Paragraph', 'Style', 'Table', 'Insert',
      'Header', 'Footer', 'Reference', 'Mailings', 'Review', 'View', 'Clipboard',
      'Format', 'Painter', 'Bookmark', 'Hyperlink', 'Citation', 'Bibliography',
      'Track Changes', 'Comment', 'Section', 'Column', 'Watermark', 'Page Break',
      'Mail Merge', 'Macro', 'Template', 'Quick Parts', 'Building Blocks',
      'SmartArt', 'Chart', 'Equation', 'Symbol', 'Text Box', 'WordArt',
      'Table of Contents', 'Index', 'Footnote', 'Endnote', 'Caption',
      'Cross-reference', 'Line Spacing', 'Indentation', 'Tab Stop', 'Ruler',
      'Navigation Pane', 'Find', 'Replace', 'Go To', 'Ctrl'
    ];

    const keywordsFound = [...new Set(
      mosTerms.filter(t => text.toLowerCase().includes(t.toLowerCase()))
    )];

    // Generate concept breakdown
    let breakdownHTML = '';
    if (keywordsFound.length > 0) {
      breakdownHTML += `<p><strong>🎯 ${keywordsFound.length} MOS Concepts Detected:</strong></p>`;
      breakdownHTML += `<div style="display:flex; flex-wrap:wrap; gap:8px; margin:12px 0">`;
      keywordsFound.forEach(kw => {
        breakdownHTML += `<span style="background:rgba(124,92,252,0.2); border:1px solid rgba(124,92,252,0.4); padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600">${kw}</span>`;
      });
      breakdownHTML += `</div>`;
      breakdownHTML += `<ul style="margin-top:12px; padding-left:20px; line-height:2">`;
      keywordsFound.slice(0, 6).forEach(kw => {
        breakdownHTML += `<li><b>${kw}:</b> A key MOS Word exam topic. Know exactly where to find it in the Ribbon and how to apply, modify, and remove it.</li>`;
      });
      breakdownHTML += `</ul>`;
    } else {
      breakdownHTML = `<p>📋 The uploaded text appears to be general notes. Focus on memorizing click sequences for each Word feature mentioned.</p>`;
    }

    // Generate practice questions
    let questionsHTML = '';
    const qCount = Math.min(amount, Math.max(sentences.length, 3));
    for (let i = 0; i < qCount; i++) {
      let source = sentences[i % sentences.length];
      if (!source) source = 'To save a document quickly, press Ctrl+S.';
      questionsHTML += `
        <div style="background:rgba(255,255,255,0.05); padding:14px; border-radius:8px; margin-bottom:12px; border-left:3px solid var(--accent-yellow)">
          <p style="margin-bottom:6px; font-weight:bold; color:var(--accent-yellow)">Q${i + 1}:</p>
          <p style="margin-bottom:8px">Based on your notes, explain the significance of:</p>
          <p style="font-style:italic; opacity:0.8; padding:8px; background:rgba(0,0,0,0.2); border-radius:6px">"${source.trim()}"</p>
        </div>`;
    }

    // Generate YouTube links
    let ytHTML = '';
    let searchTerms = keywordsFound.slice(0, 4);
    if (searchTerms.length === 0) searchTerms = ['MOS Word 2019 exam', 'Microsoft Word formatting'];
    searchTerms.forEach(term => {
      ytHTML += `
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent('MOS Word ' + term)}" 
           target="_blank" rel="noopener" class="btn btn-secondary"
           style="text-align:left; display:flex; justify-content:space-between; align-items:center">
          <span>📺 ${term}</span><span>↗</span>
        </a>`;
    });

    // Display results
    const explEl = document.getElementById('resource-explanation-content');
    const questEl = document.getElementById('resource-questions-content');
    const ytEl = document.getElementById('resource-youtube-links');
    if (explEl) explEl.innerHTML = breakdownHTML;
    if (questEl) questEl.innerHTML = questionsHTML;
    if (ytEl) ytEl.innerHTML = ytHTML;

    const outArea = document.getElementById('resource-output-area');
    if (outArea) {
      outArea.style.display = 'block';
      outArea.scrollIntoView({ behavior: 'smooth' });
    }

    // Also generate mindmap from the extracted keywords
    if (keywordsFound.length > 0) {
      this._renderMindmap(keywordsFound, text);
    }

    if (window.Storage) Storage.addActivity({ type: 'other', text: `Analyzed file: generated ${amount} questions` });
    if (window.Toast) Toast.success('Analysis complete!');
  },

  // ==========================================
  // MINDMAP GENERATOR
  // ==========================================
  generateMindmap() {
    const editor = document.getElementById('resource-notes');
    const text = editor?.value || '';
    if (text.trim().length < 10) {
      if (window.Toast) Toast.error('Write some notes first, then generate a mindmap!');
      return;
    }

    // Extract keywords from the note text
    const mosTerms = [
      'Ribbon', 'Layout', 'Margin', 'Font', 'Paragraph', 'Style', 'Table', 'Insert',
      'Header', 'Footer', 'Reference', 'Mailings', 'Review', 'View', 'Clipboard',
      'Format', 'Painter', 'Bookmark', 'Hyperlink', 'Citation', 'Track Changes',
      'Comment', 'Section', 'Column', 'Watermark', 'Page Break', 'Mail Merge',
      'Template', 'SmartArt', 'Chart', 'Equation', 'Table of Contents', 'Footnote'
    ];

    const found = mosTerms.filter(t => text.toLowerCase().includes(t.toLowerCase()));

    // Also extract capitalized phrases and lines as branches
    const lines = text.split('\n').filter(l => l.trim().length > 3);
    const branches = [];

    // Use detected MOS terms as primary branches
    found.forEach(term => branches.push(term));

    // Use short lines as additional branches (up to 12 total)
    lines.forEach(line => {
      const clean = line.trim().replace(/^[-*•#]+\s*/, '');
      if (clean.length > 3 && clean.length < 50 && branches.length < 12) {
        if (!branches.some(b => b.toLowerCase() === clean.toLowerCase())) {
          branches.push(clean);
        }
      }
    });

    if (branches.length === 0) {
      // Fallback: split text into chunks
      const words = text.split(/\s+/);
      for (let i = 0; i < Math.min(6, words.length); i += 3) {
        branches.push(words.slice(i, i + 3).join(' '));
      }
    }

    this._renderMindmap(branches, text);
    if (window.Toast) Toast.success('Mindmap generated!');
  },

  _renderMindmap(branches, sourceText) {
    const container = document.getElementById('resource-mindmap-area');
    if (!container) return;

    container.style.display = 'block';

    let canvas = document.getElementById('mindmap-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'mindmap-canvas';
      canvas.style.cssText = 'width:100%; height:500px; border-radius:12px; background:#0a0a1a; display:block';
      const canvasWrap = container.querySelector('.mindmap-canvas-wrap');
      if (canvasWrap) {
        canvasWrap.innerHTML = '';
        canvasWrap.appendChild(canvas);
      }
    }

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 800;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Clear
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);

    // Draw subtle grid
    ctx.strokeStyle = 'rgba(124,92,252,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Central node
    const centerRadius = 55;
    const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, centerRadius);
    gradient.addColorStop(0, '#7c5cfc');
    gradient.addColorStop(1, '#4a1eae');
    ctx.beginPath();
    ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MOS Word', cx, cy - 8);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Study Map', cx, cy + 10);

    // Branch colors
    const colors = [
      '#00f5d4', '#f72585', '#fee440', '#7c5cfc', '#ff6b35',
      '#4cc9f0', '#e76f51', '#2a9d8f', '#e9c46a', '#264653',
      '#b5179e', '#06d6a0'
    ];

    // Draw branches
    const count = Math.min(branches.length, 12);
    const radiusFromCenter = Math.min(W, H) * 0.32;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const bx = cx + Math.cos(angle) * radiusFromCenter;
      const by = cy + Math.sin(angle) * radiusFromCenter;
      const color = colors[i % colors.length];

      // Draw connection line (curved)
      ctx.beginPath();
      const cpx = cx + Math.cos(angle) * radiusFromCenter * 0.5 + (Math.random() - 0.5) * 30;
      const cpy = cy + Math.sin(angle) * radiusFromCenter * 0.5 + (Math.random() - 0.5) * 30;
      ctx.moveTo(cx + Math.cos(angle) * centerRadius, cy + Math.sin(angle) * centerRadius);
      ctx.quadraticCurveTo(cpx, cpy, bx, by);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw branch node
      const label = branches[i];
      ctx.font = 'bold 12px Inter, sans-serif';
      const textWidth = ctx.measureText(label).width;
      const nodeW = Math.min(textWidth + 24, 160);
      const nodeH = 34;

      // Node background
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.roundRect(bx - nodeW / 2, by - nodeH / 2, nodeW, nodeH, 10);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Node border
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bx - nodeW / 2, by - nodeH / 2, nodeW, nodeH, 10);
      ctx.stroke();

      // Node text
      ctx.fillStyle = color;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Truncate if too long
      let displayText = label;
      if (displayText.length > 20) displayText = displayText.substring(0, 18) + '…';
      ctx.fillText(displayText, bx, by);
    }

    container.scrollIntoView({ behavior: 'smooth' });
  },

  // ==========================================
  // UTILITY
  // ==========================================
  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
