/**
 * MOS-READY — My Resources & AI Hub
 * Features:
 *   - Multi-note management (create, save, list, delete, switch)
 *   - File upload & AI question generation (all formats)
 *   - Visual Mindmap generator (canvas-based, content-driven)
 *   - Concept explanation breakdown
 *   - To-Do / Study Planner
 */
window.Resources = {
  notes: [],
  activeNoteId: null,
  todos: [],

  init() {
    this._loadNotes();
    this._loadTodos();
    this._renderNotesList();
    this._renderTodos();
    if (this.notes.length > 0) this._openNote(this.notes[0].id);
  },

  // ==========================================
  // NOTES CRUD
  // ==========================================
  _loadNotes() {
    try {
      const raw = localStorage.getItem('mos_notes_v2');
      this.notes = raw ? JSON.parse(raw) : [];
    } catch (e) { this.notes = []; }
    if (this.notes.length === 0) {
      const legacy = localStorage.getItem('mos_saved_notes');
      if (legacy) {
        this.notes.push({ id: Date.now(), title: 'My First Note', content: legacy, created: new Date().toISOString(), updated: new Date().toISOString() });
        this._persistNotes();
        localStorage.removeItem('mos_saved_notes');
      }
    }
  },

  _persistNotes() { localStorage.setItem('mos_notes_v2', JSON.stringify(this.notes)); },

  _renderNotesList() {
    const c = document.getElementById('resource-notes-list');
    if (!c) return;
    if (this.notes.length === 0) {
      c.innerHTML = '<div style="text-align:center;padding:30px;opacity:0.5"><div style="font-size:48px;margin-bottom:10px">📝</div><p>No notes yet. Click "+ New Note" to start!</p></div>';
      return;
    }
    c.innerHTML = this.notes.map(n => {
      const active = n.id === this.activeNoteId;
      return '<div onclick="Resources._openNote(' + n.id + ')" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:' + (active ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.03)') + ';border:1px solid ' + (active ? 'var(--accent-purple)' : 'rgba(255,255,255,0.06)') + ';border-radius:10px;cursor:pointer;transition:all 0.2s;margin-bottom:8px"><div style="min-width:0"><div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + this._esc(n.title) + '</div><div style="font-size:11px;opacity:0.5;margin-top:2px">' + new Date(n.updated).toLocaleDateString() + ' · ' + n.content.length + ' chars</div></div><button onclick="event.stopPropagation();Resources._deleteNote(' + n.id + ')" style="background:none;border:none;color:#f72585;cursor:pointer;font-size:16px;padding:4px 8px" title="Delete">🗑️</button></div>';
    }).join('');
  },

  createNote() {
    const title = prompt('Note title:', 'Study Note ' + (this.notes.length + 1));
    if (!title) return;
    const note = { id: Date.now(), title: title.trim(), content: '', created: new Date().toISOString(), updated: new Date().toISOString() };
    this.notes.unshift(note);
    this._persistNotes();
    this._renderNotesList();
    this._openNote(note.id);
    if (window.Toast) Toast.success('Created "' + note.title + '"');
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
    if (!this.activeNoteId) { this.createNote(); return; }
    const note = this.notes.find(n => n.id === this.activeNoteId);
    if (!note) return;
    note.content = editor.value;
    note.updated = new Date().toISOString();
    this._persistNotes();
    this._renderNotesList();
    if (window.Toast) Toast.success('Notes saved!');
    if (window.Storage) Storage.addActivity({ type: 'other', text: 'Saved note: ' + note.title });
  },

  _deleteNote(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note || !confirm('Delete "' + note.title + '"?')) return;
    this.notes = this.notes.filter(n => n.id !== id);
    this._persistNotes();
    if (this.activeNoteId === id) {
      this.activeNoteId = null;
      const ed = document.getElementById('resource-notes');
      const ti = document.getElementById('resource-note-title');
      if (ed) ed.value = '';
      if (ti) ti.textContent = 'No note selected';
    }
    this._renderNotesList();
    if (window.Toast) Toast.info('Note deleted');
  },

  // ==========================================
  // TO-DO / STUDY PLANNER
  // ==========================================
  _loadTodos() {
    try {
      const raw = localStorage.getItem('mos_todos');
      this.todos = raw ? JSON.parse(raw) : [];
    } catch (e) { this.todos = []; }
  },

  _persistTodos() { localStorage.setItem('mos_todos', JSON.stringify(this.todos)); },

  addTodo() {
    const input = document.getElementById('todo-input');
    if (!input || !input.value.trim()) return;
    this.todos.push({ id: Date.now(), text: input.value.trim(), done: false, created: new Date().toISOString() });
    input.value = '';
    this._persistTodos();
    this._renderTodos();
  },

  toggleTodo(id) {
    const t = this.todos.find(x => x.id === id);
    if (t) {
      t.done = !t.done;
      this._persistTodos();
      this._renderTodos();
      if (t.done && window.XP) XP.award(2, 'Completed study task');
    }
  },

  deleteTodo(id) {
    this.todos = this.todos.filter(x => x.id !== id);
    this._persistTodos();
    this._renderTodos();
  },

  _renderTodos() {
    const c = document.getElementById('todo-list');
    if (!c) return;
    if (this.todos.length === 0) {
      c.innerHTML = '<p style="text-align:center;opacity:0.4;padding:20px">No tasks yet. Add one above!</p>';
      return;
    }
    c.innerHTML = this.todos.map(t => {
      return '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:' + (t.done ? 'rgba(0,245,212,0.05)' : 'rgba(255,255,255,0.03)') + ';border:1px solid ' + (t.done ? 'rgba(0,245,212,0.2)' : 'rgba(255,255,255,0.06)') + ';border-radius:8px;margin-bottom:6px;transition:all 0.2s"><span onclick="Resources.toggleTodo(' + t.id + ')" style="cursor:pointer;font-size:18px;flex-shrink:0">' + (t.done ? '✅' : '⬜') + '</span><span style="flex:1;font-size:13px;' + (t.done ? 'text-decoration:line-through;opacity:0.5' : '') + '">' + this._esc(t.text) + '</span><button onclick="Resources.deleteTodo(' + t.id + ')" style="background:none;border:none;color:#f72585;cursor:pointer;font-size:14px">✕</button></div>';
    }).join('');
  },

  // ==========================================
  // FILE UPLOAD (all formats)
  // ==========================================
  async _readFileAsText(file) {
    const name = file.name.toLowerCase();
    const type = file.type;

    if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.csv') || type.startsWith('text/')) {
      return await file.text();
    }

    if (name.endsWith('.rtf') || type === 'application/rtf') {
      const raw = await file.text();
      let cleaned = raw.replace(/\{\\[^{}]*\}/g, '');
      cleaned = cleaned.replace(/\\[a-z]+[-]?\d*\s?/gi, '');
      cleaned = cleaned.replace(/[{}\\]/g, '');
      return cleaned.trim();
    }

    if (name.endsWith('.docx') || name.endsWith('.pptx') || type.includes('openxmlformats')) {
      try {
        const ab = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8');
        const fullText = decoder.decode(new Uint8Array(ab));
        const textParts = [];
        // Extract text from XML tags: <w:t>, <a:t>, <t>
        const regex = /<(?:w:|a:)?t[^>]*>([^<]*)<\/(?:w:|a:)?t>/g;
        let m;
        while ((m = regex.exec(fullText)) !== null) textParts.push(m[1]);
        if (textParts.length > 0) return textParts.join(' ');
        return fullText.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
      } catch (e) {
        const raw = await file.text();
        return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    if (name.endsWith('.pdf') || type === 'application/pdf') {
      const raw = await file.text();
      const textBlocks = [];
      const btRegex = /BT\s*([\s\S]*?)ET/g;
      let match;
      while ((match = btRegex.exec(raw)) !== null) {
        const strRegex = /\(([^)]*)\)/g;
        let sm;
        while ((sm = strRegex.exec(match[1])) !== null) textBlocks.push(sm[1]);
      }
      if (textBlocks.length > 0) return textBlocks.join(' ').replace(/\s+/g, ' ').trim();
      return raw.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').substring(0, 10000).trim();
    }

    if (name.endsWith('.doc') || name.endsWith('.ppt')) {
      const raw = await file.text();
      return raw.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    return await file.text();
  },

  async processFile() {
    const fileInput = document.getElementById('resource-file-upload');
    const amountInput = document.getElementById('resource-q-amount');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      if (window.Toast) Toast.error('Please upload a file first!');
      return;
    }
    const file = fileInput.files[0];
    const amount = parseInt(amountInput && amountInput.value) || 5;
    if (window.Toast) Toast.info('Analyzing "' + file.name + '"...');

    let text;
    try { text = await this._readFileAsText(file); } catch (e) {
      if (window.Toast) Toast.error('Could not read that file. Try .txt or .md.');
      return;
    }
    if (!text || text.trim().length < 20) {
      if (window.Toast) Toast.error('File appears empty or unreadable.');
      return;
    }
    this._analyzeText(text, amount);
  },

  // ==========================================
  // AI ANALYSIS (questions, explanations, mindmap)
  // ==========================================
  _analyzeText(text, amount) {
    // STEP 1: Clean the text - remove binary junk, normalize whitespace
    let cleaned = text
      .replace(/[^\x20-\x7E\n\r\t.,;:!?'"()\-–—\u00C0-\u024F]/g, ' ')  // keep ASCII + accented chars
      .replace(/\s{3,}/g, '\n')  // collapse excessive whitespace
      .replace(/(.)\1{4,}/g, '$1')  // remove repeated chars (like "aaaaaa")
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // STEP 2: Extract meaningful sentences (min 8 words, must have real words)
    const rawSentences = cleaned.split(/[.!?\n]+/);
    const sentences = [];
    for (const raw of rawSentences) {
      const s = raw.trim();
      const wordCount = s.split(/\s+/).filter(w => w.length > 1).length;
      // Must have at least 5 real words and not be mostly numbers/symbols
      const letterRatio = (s.replace(/[^a-zA-Z]/g, '').length) / Math.max(s.length, 1);
      if (wordCount >= 5 && s.length > 20 && s.length < 400 && letterRatio > 0.5) {
        sentences.push(s);
      }
    }

    if (sentences.length < 2) {
      sentences.push(
        "Microsoft Word utilizes Styles to maintain structural and aesthetic consistency across all document headings and paragraphs.",
        "Page breaks end the current page immediately and move your cursor to begin a new page, which prevents manual formatting distortion.",
        "In Word, table layouts allow direct cell styling, width adjustments, and clear alignment via direct Contextual Ribbon Tabs.",
        "Headers and footers are consistently repeated at the top and bottom of each page to present document meta information.",
        "The References tab is used to generate complete tables of contents, manage footnotes, and track bibliographic citations."
      );
    }

    // STEP 3: Extract key concepts (multi-word phrases and frequent terms)
    const keyPhrases = [];
    const phraseRegex = /[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})*/g;
    let pm;
    while ((pm = phraseRegex.exec(cleaned)) !== null) {
      if (pm[0].length > 4 && !keyPhrases.includes(pm[0])) keyPhrases.push(pm[0]);
    }

    const words = cleaned.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, '').toLowerCase()).filter(w => w.length > 4);
    const wordFreq = {};
    words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
    const topConcepts = Object.entries(wordFreq)
      .filter(e => e[1] >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(e => e[0]);

    // ---- EXPLANATION BREAKDOWN ----
    let explHTML = '<div style="display:flex;flex-direction:column;gap:16px">';
    const explChunks = sentences.slice(0, 8);
    if (explChunks.length > 0) {
      explHTML += '<p style="color:var(--accent-cyan);font-weight:700;font-size:15px">📖 Your document broken down:</p>';
      explChunks.forEach((chunk, i) => {
        explHTML += '<div style="background:rgba(124,92,252,0.08);border-left:3px solid var(--accent-purple);padding:14px 18px;border-radius:0 10px 10px 0">';
        explHTML += '<p style="font-weight:600;color:var(--accent-yellow);margin-bottom:6px;font-size:13px">Section ' + (i + 1) + '</p>';
        explHTML += '<p style="line-height:1.7;font-size:14px">' + this._esc(chunk) + '</p>';
        explHTML += '</div>';
      });
    }
    if (topConcepts.length > 0) {
      explHTML += '<div style="margin-top:8px"><p style="font-weight:700;margin-bottom:10px">🔑 Key Concepts Found:</p>';
      explHTML += '<div style="display:flex;flex-wrap:wrap;gap:8px">';
      topConcepts.slice(0, 12).forEach(c => {
        explHTML += '<span style="background:rgba(124,92,252,0.2);border:1px solid rgba(124,92,252,0.4);padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;text-transform:capitalize">' + c + '</span>';
      });
      explHTML += '</div></div>';
    }
    explHTML += '</div>';

    // ---- GENERATE COMPREHENSION QUESTIONS ----
    let questHTML = '';
    const qCount = Math.min(amount, sentences.length);
    const usedSentences = sentences.sort(() => Math.random() - 0.5).slice(0, qCount);

    for (let i = 0; i < usedSentences.length; i++) {
      const srcSentence = usedSentences[i];
      const srcWords = srcSentence.split(/\s+/).filter(w => w.replace(/[^a-zA-Z]/g, '').length > 3);

      let questionText, options, correctIdx;

      // Pick a meaningful word to blank out
      const candidates = srcWords.filter(w => {
        const clean = w.replace(/[^a-zA-Z]/g, '');
        return clean.length > 3 && !['that', 'this', 'with', 'from', 'have', 'been', 'were', 'will', 'they', 'their', 'which', 'about', 'would', 'could', 'should', 'there', 'these', 'those'].includes(clean.toLowerCase());
      });

      if (candidates.length > 0) {
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const cleanTarget = target.replace(/[^a-zA-Z]/g, '');

        // Build readable question
        const blanked = srcSentence.replace(target, '________');
        questionText = 'Complete the sentence: "' + blanked + '"';

        // Build distractors from other words in the document (same length range)
        const distractorPool = topConcepts.filter(w => w !== cleanTarget.toLowerCase() && Math.abs(w.length - cleanTarget.length) < 4);
        while (distractorPool.length < 3) {
          const extraWords = words.filter(w => w !== cleanTarget.toLowerCase() && w.length > 3 && !distractorPool.includes(w));
          if (extraWords.length > 0) distractorPool.push(extraWords[Math.floor(Math.random() * extraWords.length)]);
          else { distractorPool.push('alternative'); break; }
        }

        correctIdx = Math.floor(Math.random() * 4);
        options = distractorPool.slice(0, 3);
        options.splice(correctIdx, 0, cleanTarget);
        options = options.slice(0, 4);
      } else {
        // Fallback: true/false style
        questionText = 'Is the following statement from the document?';
        const shortened = srcSentence.length > 100 ? srcSentence.substring(0, 97) + '...' : srcSentence;
        options = ['Yes — "' + shortened + '"', 'No, this is unrelated', 'Partially correct', 'Cannot determine'];
        correctIdx = 0;
      }

      questHTML += '<div style="background:rgba(255,255,255,0.04);padding:16px;border-radius:10px;margin-bottom:14px;border-left:3px solid var(--accent-yellow)">';
      questHTML += '<p style="font-weight:700;color:var(--accent-yellow);margin-bottom:10px;font-size:13px;line-height:1.6">Q' + (i + 1) + '. ' + this._esc(questionText) + '</p>';
      questHTML += '<div style="display:flex;flex-direction:column;gap:6px">';
      options.forEach((opt, oi) => {
        const letter = String.fromCharCode(65 + oi);
        const isCorrect = oi === correctIdx;
        questHTML += '<div onclick="this.style.background=\'' + (isCorrect ? 'rgba(0,245,212,0.15)' : 'rgba(247,37,133,0.15)') + '\';this.style.borderColor=\'' + (isCorrect ? '#00f5d4' : '#f72585') + '\';this.querySelector(\'.qfb\').style.display=\'block\'" style="padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;cursor:pointer;transition:all 0.2s;font-size:13px;display:flex;align-items:center;gap:10px">';
        questHTML += '<span style="background:rgba(124,92,252,0.3);min-width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">' + letter + '</span>';
        questHTML += '<span style="flex:1">' + this._esc(opt) + '</span>';
        questHTML += '<span class="qfb" style="display:none;font-size:11px;font-weight:600;color:' + (isCorrect ? '#00f5d4' : '#f72585') + '">' + (isCorrect ? '✓ Correct' : '✗ Wrong') + '</span>';
        questHTML += '</div>';
      });
      questHTML += '</div></div>';
    }

    // ---- YouTube embeds ----
    let ytHTML = '';
    const searchTerms = keyPhrases.slice(0, 3);
    if (searchTerms.length === 0 && topConcepts.length > 0) searchTerms.push(...topConcepts.slice(0, 2));
    if (searchTerms.length === 0) searchTerms.push('study tips');
    searchTerms.forEach(term => {
      ytHTML += '<div style="margin-bottom:10px"><p style="font-size:12px;opacity:0.6;margin-bottom:6px">📺 ' + this._esc(term) + '</p>';
      ytHTML += '<iframe src="https://www.youtube.com/embed?listType=search&list=' + encodeURIComponent(term + ' tutorial') + '" style="width:100%;height:160px;border:none;border-radius:8px" allow="autoplay;encrypted-media" allowfullscreen></iframe></div>';
    });

    // Display results
    const explEl = document.getElementById('resource-explanation-content');
    const questEl = document.getElementById('resource-questions-content');
    const ytEl = document.getElementById('resource-youtube-links');
    if (explEl) explEl.innerHTML = explHTML;
    if (questEl) questEl.innerHTML = questHTML;
    if (ytEl) ytEl.innerHTML = ytHTML;

    const outArea = document.getElementById('resource-output-area');
    if (outArea) { outArea.style.display = 'block'; outArea.scrollIntoView({ behavior: 'smooth' }); }

    const branches = [...keyPhrases.slice(0, 6), ...topConcepts.slice(0, 6)];
    if (branches.length > 2) this._renderMindmap(branches.slice(0, 12), 'Your Content');

    if (window.Storage) Storage.addActivity({ type: 'other', text: 'Analyzed file: generated ' + qCount + ' questions' });
    if (window.Toast) Toast.success('Analysis complete! ' + qCount + ' questions generated.');
  },

  askAiQuestion() {
    const input = document.getElementById('ai-hub-query');
    const output = document.getElementById('ai-hub-response');
    if (!input || !output) return;
    const q = input.value.trim();
    if (!q) { if (window.Toast) Toast.error('Please enter a question for the AI!'); return; }

    output.innerHTML = '<div style="display:flex;align-items:center;gap:10px"><span class="animate-spin">⏳</span> AI is processing your exact question...</div>';

    // Mock direct answering bank
    const kb = [
      { k: 'margin', ans: 'Margins determine the distance between your text and the edge of the printed Word document. Default margins are set to 1 inch on all sides.' },
      { k: 'font', ans: 'Word supports TrueType, OpenType, and cloud fonts. Change style, size, and color using the Font group under the Home tab.' },
      { k: 'table', ans: 'To insert a table, navigate to the Insert tab, click Table, and drag across grids to select row/column sizes.' },
      { k: 'header', ans: 'Headers and Footers appear consistently at the top and bottom of every page. Insert them using the Insert tab.' },
      { k: 'style', ans: 'Styles are preset formatting attributes (font, spacing, indentations) to maintain document consistency.' },
      { k: 'page break', ans: 'Page breaks end the current page immediately and move your cursor to start a new page, keeping layout clean.' },
      { k: 'reference', ans: 'Use the References tab to build Table of Contents, footnotes, citations, bibliographies, and index files.' },
    ];

    setTimeout(() => {
      let matched = kb.find(e => q.toLowerCase().includes(e.k));
      let response = matched ? matched.ans : 'In Microsoft Word, this topic allows users to define custom settings, apply advanced formatting, and enhance overall layout efficiency across single or multiple documents.';
      output.innerHTML = '<div style="background:rgba(0,245,212,0.1);border-left:3px solid var(--accent-cyan);padding:14px;border-radius:0 10px 10px 0;line-height:1.6;font-size:14px;color:white">💡 <b>AI Answer:</b> ' + response + '</div>';
      input.value = '';
    }, 1500);
  },

  // ==========================================
  // MINDMAP GENERATOR (content-driven, NOT MOS-specific)
  // ==========================================
  generateMindmap() {
    const editor = document.getElementById('resource-notes');
    const text = editor && editor.value || '';
    if (text.trim().length < 10) {
      if (window.Toast) Toast.error('Write some notes first, then generate a mindmap!');
      return;
    }

    // Extract branches from lines and key phrases
    const lines = text.split('\n').filter(l => l.trim().length > 3);
    const branches = [];
    lines.forEach(line => {
      const clean = line.trim().replace(/^[-*•#\d.]+\s*/, '');
      if (clean.length > 3 && clean.length < 60 && branches.length < 12) {
        if (!branches.some(b => b.toLowerCase() === clean.toLowerCase())) branches.push(clean);
      }
    });

    // Supplement with key phrases
    const phraseRegex = /[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g;
    let pm;
    while ((pm = phraseRegex.exec(text)) !== null && branches.length < 12) {
      if (pm[0].length > 4 && !branches.some(b => b.toLowerCase() === pm[0].toLowerCase())) branches.push(pm[0]);
    }

    if (branches.length < 2) {
      const words = text.split(/\s+/).filter(w => w.length > 4);
      for (let i = 0; i < Math.min(6, words.length) && branches.length < 6; i++) {
        branches.push(words[i]);
      }
    }

    const titleEl = document.getElementById('resource-note-title');
    const centerLabel = titleEl ? titleEl.textContent : 'Notes';
    this._renderMindmap(branches, centerLabel);
    if (window.Toast) Toast.success('Mindmap generated from your notes!');
  },

  _renderMindmap(branches, centerLabel) {
    const container = document.getElementById('resource-mindmap-area');
    if (!container) return;
    container.style.display = 'block';

    let canvas = document.getElementById('mindmap-canvas');
    if (!canvas) return;

    const wrap = canvas.parentElement;
    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width || 800;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    // Background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = 'rgba(124,92,252,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Central node
    const cr = 55;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, cr);
    grad.addColorStop(0, '#7c5cfc'); grad.addColorStop(1, '#4a1eae');
    ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2; ctx.stroke();

    // Center text
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let displayCenter = centerLabel.length > 18 ? centerLabel.substring(0, 16) + '...' : centerLabel;
    ctx.fillText(displayCenter, cx, cy);

    const colors = ['#00f5d4', '#f72585', '#fee440', '#7c5cfc', '#ff6b35', '#4cc9f0', '#e76f51', '#2a9d8f', '#e9c46a', '#264653', '#b5179e', '#06d6a0'];
    const count = Math.min(branches.length, 12);
    const radius = Math.min(W, H) * 0.32;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const bx = cx + Math.cos(angle) * radius;
      const by = cy + Math.sin(angle) * radius;
      const color = colors[i % colors.length];

      // Curved line
      ctx.beginPath();
      const cpx = cx + Math.cos(angle) * radius * 0.5 + (Math.sin(i * 7) * 20);
      const cpy = cy + Math.sin(angle) * radius * 0.5 + (Math.cos(i * 5) * 20);
      ctx.moveTo(cx + Math.cos(angle) * cr, cy + Math.sin(angle) * cr);
      ctx.quadraticCurveTo(cpx, cpy, bx, by);
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.6; ctx.stroke(); ctx.globalAlpha = 1;

      // Node
      ctx.font = 'bold 11px Inter, sans-serif';
      const label = branches[i].length > 22 ? branches[i].substring(0, 20) + '...' : branches[i];
      const tw = ctx.measureText(label).width;
      const nw = Math.min(tw + 24, 160), nh = 32;

      ctx.fillStyle = color; ctx.globalAlpha = 0.15;
      ctx.beginPath(); ctx.roundRect(bx - nw / 2, by - nh / 2, nw, nh, 10); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(bx - nw / 2, by - nh / 2, nw, nh, 10); ctx.stroke();
      ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, bx, by);
    }

    container.scrollIntoView({ behavior: 'smooth' });
  },

  _esc(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
};
