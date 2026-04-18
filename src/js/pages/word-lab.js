/**
 * MOS-READY — Word Lab (MS Word Integration + Embedded Editor)
 * Includes: Launch real Word, OR use built-in rich text editor
 * Task verification via self-check
 */
const WordLabPage = {
  wordLaunched: false,
  editorMode: false,

  tasks: [
    { id: 1, title: 'Create a new blank document', instruction: 'Open Word and create a new blank document using Ctrl+N.', xp: 5 },
    { id: 2, title: 'Type a title with Heading 1 style', instruction: 'Type "MOS Word Practice" and apply Heading 1 style from the Home tab.', xp: 5 },
    { id: 3, title: 'Add 3 paragraphs of text', instruction: 'Type or paste 3 paragraphs of sample text. You can use =lorem() to generate placeholder text.', xp: 5 },
    { id: 4, title: 'Apply Bold and Italic formatting', instruction: 'Select a word and make it Bold (Ctrl+B). Select another and make it Italic (Ctrl+I).', xp: 5 },
    { id: 5, title: 'Insert a table', instruction: 'Go to Insert → Table and create a 3x4 table. Fill some cells with data.', xp: 10 },
    { id: 6, title: 'Apply a table style', instruction: 'Click the table, go to Table Design tab, and apply a built-in table style.', xp: 5 },
    { id: 7, title: 'Change page margins', instruction: 'Go to Layout → Margins and select "Narrow" margins.', xp: 5 },
    { id: 8, title: 'Insert a header with page numbers', instruction: 'Go to Insert → Header → Blank. Then insert page numbers.', xp: 10 },
    { id: 9, title: 'Add a footer with your name', instruction: 'Go to Insert → Footer → Blank. Type your name in the footer.', xp: 5 },
    { id: 10, title: 'Insert a picture and wrap text', instruction: 'Insert any image and set text wrapping to "Square" from Picture Format.', xp: 10 },
    { id: 11, title: 'Create a bulleted list', instruction: 'Type 5 items and apply bullet formatting from the Home tab.', xp: 5 },
    { id: 12, title: 'Save as PDF', instruction: 'Go to File → Save As and save the document as a PDF file.', xp: 10 }
  ],

  init() {
    this.renderTasks();
    Router.onPageEnter('word-lab', () => this.renderTasks());
  },

  renderTasks() {
    const container = document.getElementById('word-task-list');
    if (!container) return;

    const completed = Storage.get('wordTasks', []);

    container.innerHTML = this.tasks.map(task => {
      const isCompleted = completed.includes(task.id);
      return `
        <div class="word-task-item ${isCompleted ? 'completed' : ''}" onclick="WordLabPage.toggleTask(${task.id})">
          <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:4px">
            <span style="font-size:16px">${isCompleted ? '✅' : '⬜'}</span>
            <span class="font-semibold text-sm">${task.title}</span>
          </div>
          <p class="text-xs text-secondary" style="margin-left:28px">${task.instruction}</p>
          <div style="margin-left:28px;margin-top:4px">
            <span class="badge badge-primary" style="font-size:0.65rem">+${task.xp} XP</span>
          </div>
        </div>
      `;
    }).join('');

    // Update embed area
    this._updateEmbed();
  },

  toggleTask(taskId) {
    const completed = Storage.get('wordTasks', []);
    const task = this.tasks.find(t => t.id === taskId);

    if (completed.includes(taskId)) {
      // Already completed — do nothing
      return;
    }

    completed.push(taskId);
    Storage.set('wordTasks', completed);

    if (task) {
      XP.award(task.xp, `Word Task: ${task.title}`);
      Storage.addActivity({ type: 'learn', text: `Completed Word task: ${task.title}` });
    }

    // Check if all done
    if (completed.length === this.tasks.length) {
      XP.award(30, 'All Word Lab tasks complete!');
      Confetti.burst();
    }

    this.renderTasks();
  },

  async launchWord() {
    try {
      const response = await fetch('/api/word/launch', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        this.wordLaunched = true;
        this._updateEmbed();
        Toast.success('Microsoft Word launched! Complete the tasks on the left.');
      } else {
        this._showManualLaunch();
      }
    } catch {
      this._showManualLaunch();
    }
  },

  _showManualLaunch() {
    this.wordLaunched = true;
    this._updateEmbed();

    try {
      window.open('ms-word:', '_blank');
    } catch (e) {
      // Ignore
    }

    Toast.info('Please open Microsoft Word manually. Complete tasks and check them off!');
  },

  // Open the built-in rich text editor (for users without MS Word)
  openEditor() {
    this.editorMode = true;
    this._updateEmbed();
    Toast.success('📄 Built-in editor loaded! Practice Word tasks right here.');
  },

  _updateEmbed() {
    const embedArea = document.getElementById('word-embed-area');
    if (!embedArea) return;

    const completed = Storage.get('wordTasks', []);
    const progress = Math.round((completed.length / this.tasks.length) * 100);

    if (this.editorMode) {
      // Full rich text editor
      embedArea.innerHTML = `
        <div style="display:flex;flex-direction:column;height:100%;width:100%">
          <!-- Editor Toolbar -->
          <div style="background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);padding:8px 12px;display:flex;flex-wrap:wrap;gap:4px;border-radius:var(--radius-lg) var(--radius-lg) 0 0">
            <button class="editor-btn" onclick="document.execCommand('bold')" title="Bold (Ctrl+B)"><b>B</b></button>
            <button class="editor-btn" onclick="document.execCommand('italic')" title="Italic (Ctrl+I)"><i>I</i></button>
            <button class="editor-btn" onclick="document.execCommand('underline')" title="Underline (Ctrl+U)"><u>U</u></button>
            <button class="editor-btn" onclick="document.execCommand('strikeThrough')" title="Strikethrough"><s>S</s></button>
            <div style="width:1px;background:var(--border-default);margin:0 4px"></div>
            <button class="editor-btn" onclick="document.execCommand('formatBlock','','H1')" title="Heading 1">H1</button>
            <button class="editor-btn" onclick="document.execCommand('formatBlock','','H2')" title="Heading 2">H2</button>
            <button class="editor-btn" onclick="document.execCommand('formatBlock','','H3')" title="Heading 3">H3</button>
            <button class="editor-btn" onclick="document.execCommand('formatBlock','','P')" title="Normal">¶</button>
            <div style="width:1px;background:var(--border-default);margin:0 4px"></div>
            <button class="editor-btn" onclick="document.execCommand('justifyLeft')" title="Align Left">⬛◻◻</button>
            <button class="editor-btn" onclick="document.execCommand('justifyCenter')" title="Center">◻⬛◻</button>
            <button class="editor-btn" onclick="document.execCommand('justifyRight')" title="Align Right">◻◻⬛</button>
            <button class="editor-btn" onclick="document.execCommand('justifyFull')" title="Justify">⬛⬛⬛</button>
            <div style="width:1px;background:var(--border-default);margin:0 4px"></div>
            <button class="editor-btn" onclick="document.execCommand('insertUnorderedList')" title="Bullets">• List</button>
            <button class="editor-btn" onclick="document.execCommand('insertOrderedList')" title="Numbers">1. List</button>
            <button class="editor-btn" onclick="document.execCommand('indent')" title="Indent">→ Tab</button>
            <button class="editor-btn" onclick="document.execCommand('outdent')" title="Outdent">← Tab</button>
            <div style="width:1px;background:var(--border-default);margin:0 4px"></div>
            <button class="editor-btn" onclick="WordLabPage._insertTable()" title="Insert Table">📊</button>
            <button class="editor-btn" onclick="document.execCommand('insertHorizontalRule')" title="Horizontal Line">—</button>
            <select onchange="document.execCommand('fontName',false,this.value);this.selectedIndex=0" style="background:var(--bg-glass);color:var(--text-primary);border:1px solid var(--border-default);border-radius:4px;padding:2px 6px;font-size:0.75rem">
              <option value="">Font</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial">Arial</option>
              <option value="Calibri">Calibri</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
            </select>
            <select onchange="document.execCommand('fontSize',false,this.value);this.selectedIndex=0" style="background:var(--bg-glass);color:var(--text-primary);border:1px solid var(--border-default);border-radius:4px;padding:2px 6px;font-size:0.75rem">
              <option value="">Size</option>
              <option value="1">Small</option>
              <option value="3">Normal</option>
              <option value="5">Large</option>
              <option value="7">Huge</option>
            </select>
          </div>

          <!-- Editor Content Area -->
          <div id="word-editor"
            contenteditable="true"
            spellcheck="true"
            style="flex:1;background:white;color:#222;padding:40px 60px;font-family:'Times New Roman',serif;font-size:14px;
              line-height:1.8;overflow-y:auto;outline:none;min-height:500px;
              box-shadow:inset 0 2px 8px rgba(0,0,0,0.1);border-radius:0 0 var(--radius-lg) var(--radius-lg)"
          >
            <p style="color:#888;font-style:italic">Start typing here... This is your Word practice area. Try the tasks on the left panel!</p>
          </div>

          <!-- Editor Status Bar -->
          <div style="display:flex;justify-content:space-between;padding:6px 12px;background:var(--bg-surface);border-top:1px solid var(--border-subtle);font-size:0.7rem;color:var(--text-tertiary)">
            <span>📄 MOS-READY Word Editor</span>
            <span>Progress: ${progress}%</span>
            <span id="word-count-display">Words: 0</span>
          </div>
        </div>
      `;

      // Auto word count
      const editor = document.getElementById('word-editor');
      if (editor) {
        editor.addEventListener('input', () => {
          const text = editor.innerText.trim();
          const words = text ? text.split(/\s+/).length : 0;
          const wcDisplay = document.getElementById('word-count-display');
          if (wcDisplay) wcDisplay.textContent = `Words: ${words}`;
        });

        // Focus the editor
        editor.focus();

        // Clear placeholder on focus
        editor.addEventListener('focus', function onFocus() {
          if (editor.innerHTML.includes('Start typing here')) {
            editor.innerHTML = '';
          }
          editor.removeEventListener('focus', onFocus);
        });
      }

    } else if (this.wordLaunched) {
      embedArea.innerHTML = `
        <div style="text-align:center;padding:var(--space-2xl)">
          <div style="font-size:64px;margin-bottom:var(--space-md)">📄</div>
          <h3 class="heading-4 mb-sm">Microsoft Word is Open</h3>
          <p class="text-sm text-secondary mb-lg">
            Complete the tasks in Word, then check them off in the left panel to earn XP!
          </p>
          <div style="display:flex;align-items:center;gap:var(--space-md);justify-content:center">
            <div class="progress-bar" style="width:200px">
              <div class="progress-bar__fill" style="width:${progress}%"></div>
            </div>
            <span class="badge badge-success">${progress}%</span>
          </div>
        </div>
      `;
    } else {
      embedArea.innerHTML = `
        <div style="text-align:center;padding:var(--space-2xl)">
          <div class="word-panel__embed-icon">📄</div>
          <div class="word-panel__embed-text">
            <p class="font-semibold mb-md">Choose Your Practice Mode</p>
            <p class="text-sm text-secondary mb-xl">Use Microsoft Word on your computer, or practice with our built-in editor</p>
          </div>
          <div style="display:flex;gap:var(--space-md);justify-content:center;margin-top:var(--space-lg)">
            <button class="btn btn-primary" onclick="WordLabPage.launchWord()">
              📄 Launch MS Word
            </button>
            <button class="btn btn-secondary" onclick="WordLabPage.openEditor()">
              ✏️ Use Built-in Editor
            </button>
          </div>
          <p class="text-xs text-tertiary mt-lg">💡 Don't have Word? Use the built-in editor to practice formatting, tables, and more.</p>
        </div>
      `;
    }
  },

  _insertTable() {
    const rows = prompt('How many rows?', '3');
    const cols = prompt('How many columns?', '3');
    if (!rows || !cols) return;

    let html = '<table style="width:100%;border-collapse:collapse;margin:12px 0">';
    for (let r = 0; r < parseInt(rows); r++) {
      html += '<tr>';
      for (let c = 0; c < parseInt(cols); c++) {
        const tag = r === 0 ? 'th' : 'td';
        html += `<${tag} style="border:1px solid #ccc;padding:8px;text-align:left">${r === 0 ? 'Header ' + (c + 1) : ''}</${tag}>`;
      }
      html += '</tr>';
    }
    html += '</table><p></p>';

    document.execCommand('insertHTML', false, html);
  }
};

window.WordLabPage = WordLabPage;
