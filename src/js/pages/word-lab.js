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
      if(!this._activeTab) this._activeTab = 'home';
      
      // Full rich text editor
      embedArea.innerHTML = `
        <div style="display:flex;flex-direction:column;height:100%;width:100%;background:#e1dfdd;font-family:'Segoe UI',sans-serif">
          
          <!-- Modern High-Contrast Ribbon Header -->
          <div style="background:#1d3557;color:white;display:flex;padding:6px 10px 0 10px;font-size:13px;border-bottom:1px solid #10213b">
             <div onclick="WordLabPage.switchTab('home')" style="padding:6px 16px;cursor:pointer;border-radius:4px 4px 0 0;font-weight:600;${this._activeTab==='home'?'background:#f3f2f1;color:#1d3557':'color:white;opacity:0.8'}">Home</div>
             <div onclick="WordLabPage.switchTab('insert')" style="padding:6px 16px;cursor:pointer;border-radius:4px 4px 0 0;font-weight:600;${this._activeTab==='insert'?'background:#f3f2f1;color:#1d3557':'color:white;opacity:0.8'}">Insert</div>
             <div onclick="WordLabPage.switchTab('design')" style="padding:6px 16px;cursor:pointer;border-radius:4px 4px 0 0;font-weight:600;${this._activeTab==='design'?'background:#f3f2f1;color:#1d3557':'color:white;opacity:0.8'}">Design</div>
             <div onclick="WordLabPage.switchTab('layout')" style="padding:6px 16px;cursor:pointer;border-radius:4px 4px 0 0;font-weight:600;${this._activeTab==='layout'?'background:#f3f2f1;color:#1d3557':'color:white;opacity:0.8'}">Layout</div>
          </div>
          
          <!-- Ribbon Body: Home Tab -->
          <div id="ribbon-home" style="background:#f3f2f1;border-bottom:1px solid #c8c6c4;padding:8px 12px;display:${this._activeTab==='home'?'flex':'none'};gap:20px;box-shadow:0 2px 4px rgba(0,0,0,0.05);min-height:80px">
            <!-- Clipboard Group -->
            <div style="display:flex;flex-direction:column;align-items:center;border-right:1px solid #c8c6c4;padding-right:15px">
               <div style="display:flex;gap:4px">
                  <button class="editor-btn" onclick="document.execCommand('copy')" style="background:#fff;border:1px solid #a19f9d;padding:4px 8px;border-radius:2px">✂️ Cut</button>
                  <button class="editor-btn" onclick="document.execCommand('paste')" style="background:#fff;border:1px solid #a19f9d;padding:4px 8px;border-radius:2px">📋 Paste</button>
               </div>
               <span style="font-size:11px;color:#323130;margin-top:6px;font-weight:600">Clipboard</span>
            </div>

            <!-- Font Group -->
            <div style="display:flex;flex-direction:column;align-items:center;border-right:1px solid #c8c6c4;padding-right:15px">
               <div style="display:flex;gap:4px;margin-bottom:6px">
                  <select onchange="document.execCommand('fontName',false,this.value);this.selectedIndex=0" style="background:#fff;border:1px solid #8a8886;font-size:12px;padding:3px;border-radius:2px">
                    <option value="">Calibri (Body)</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                  <select onchange="document.execCommand('fontSize',false,this.value);this.selectedIndex=0" style="background:#fff;border:1px solid #8a8886;font-size:12px;padding:3px;border-radius:2px;width:50px">
                    <option value="3">11</option>
                    <option value="4">12</option>
                    <option value="5">14</option>
                    <option value="6">16</option>
                  </select>
               </div>
               <div style="display:flex;gap:4px">
                  <button class="editor-btn" style="font-weight:bold;background:#fff;border:1px solid #a19f9d;padding:2px 8px" onclick="document.execCommand('bold')">B</button>
                  <button class="editor-btn" style="font-style:italic;background:#fff;border:1px solid #a19f9d;padding:2px 8px" onclick="document.execCommand('italic')">I</button>
                  <button class="editor-btn" style="text-decoration:underline;background:#fff;border:1px solid #a19f9d;padding:2px 8px" onclick="document.execCommand('underline')">U</button>
                  <div style="width:1px;background:#a19f9d;margin:0 2px"></div>
                  <input type="color" onchange="document.execCommand('foreColor',false,this.value)" title="Text Color" style="height:24px;width:24px;padding:0;border:none">
                  <input type="color" onchange="document.execCommand('hiliteColor',false,this.value)" title="Highlight Color" value="#ffff00" style="height:24px;width:24px;padding:0;border:none">
               </div>
               <span style="font-size:11px;color:#323130;margin-top:6px;font-weight:600">Font</span>
            </div>

            <!-- Paragraph Group -->
            <div style="display:flex;flex-direction:column;align-items:center;border-right:1px solid #c8c6c4;padding-right:15px">
               <div style="display:flex;gap:4px;margin-bottom:6px">
                  <button class="editor-btn" onclick="document.execCommand('insertUnorderedList')" style="background:#fff;border:1px solid #a19f9d;padding:2px 8px">•≡</button>
                  <button class="editor-btn" onclick="document.execCommand('insertOrderedList')" style="background:#fff;border:1px solid #a19f9d;padding:2px 8px">1≡</button>
               </div>
               <div style="display:flex;gap:4px">
                  <button class="editor-btn" onclick="document.execCommand('justifyLeft')" style="background:#fff;border:1px solid #a19f9d;padding:2px 8px">L≡</button>
                  <button class="editor-btn" onclick="document.execCommand('justifyCenter')" style="background:#fff;border:1px solid #a19f9d;padding:2px 8px">C≡</button>
                  <button class="editor-btn" onclick="document.execCommand('justifyRight')" style="background:#fff;border:1px solid #a19f9d;padding:2px 8px">R≡</button>
               </div>
               <span style="font-size:11px;color:#323130;margin-top:6px;font-weight:600">Paragraph</span>
            </div>
          </div>

          <!-- Ribbon Body: Insert Tab -->
          <div id="ribbon-insert" style="background:#f3f2f1;border-bottom:1px solid #c8c6c4;padding:8px 12px;display:${this._activeTab==='insert'?'flex':'none'};gap:20px;box-shadow:0 2px 4px rgba(0,0,0,0.05);min-height:80px">
             <div style="display:flex;flex-direction:column;align-items:center;border-right:1px solid #c8c6c4;padding-right:15px">
                <button class="editor-btn" onclick="WordLabPage._insertTable()" style="background:#fff;border:1px solid #a19f9d;padding:10px 15px;border-radius:2px;font-size:16px">📊 Table</button>
                <span style="font-size:11px;color:#323130;margin-top:6px;font-weight:600">Tables</span>
             </div>
             <div style="display:flex;flex-direction:column;align-items:center;border-right:1px solid #c8c6c4;padding-right:15px">
                <button class="editor-btn" onclick="document.execCommand('insertHorizontalRule')" style="background:#fff;border:1px solid #a19f9d;padding:10px 15px;border-radius:2px">➖ Horiz. Line</button>
                <span style="font-size:11px;color:#323130;margin-top:6px;font-weight:600">Illustrations</span>
             </div>
             <div style="display:flex;flex-direction:column;align-items:center;padding-right:15px">
                <button class="editor-btn" onclick="document.execCommand('createLink',false,prompt('URL:','http://'))" style="background:#fff;border:1px solid #a19f9d;padding:10px 15px;border-radius:2px">🔗 Link</button>
                <span style="font-size:11px;color:#323130;margin-top:6px;font-weight:600">Links</span>
             </div>
          </div>

          <!-- Ribbon Body: Design & Layout Tabs (Stubs) -->
          <div id="ribbon-other" style="background:#f3f2f1;border-bottom:1px solid #c8c6c4;padding:8px 12px;display:${(this._activeTab==='design'||this._activeTab==='layout')?'flex':'none'};align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.05);min-height:80px">
             <p style="color:#605e5c;font-size:13px;font-style:italic">This tab contains advanced features available in the full MOS exam environment.</p>
          </div>

          <!-- Document Workspace Area (A4 Paper emulation) -->
          <div style="flex:1;background:#e1dfdd;overflow-y:auto;display:flex;justify-content:center;padding:30px 20px">
             <div id="word-editor"
                  contenteditable="true"
                  spellcheck="true"
                  style="background:white;width:21cm;min-height:29.7cm;padding:2.54cm;font-family:'Calibri',sans-serif;font-size:11pt;line-height:1.15;color:#000;box-shadow:0 4px 6px rgba(0,0,0,0.1);outline:none">
                <p style="color:#888;font-style:italic">Start typing here... Try completing the tasks on the left.</p>
             </div>
          </div>

          <!-- Editor Status Bar -->
          <div style="display:flex;justify-content:space-between;padding:4px 12px;background:#f3f2f1;border-top:1px solid #e1dfdd;font-size:12px;color:#605e5c;font-family:'Segoe UI',sans-serif">
            <span>Page 1 of 1</span>
            <span id="word-count-display">0 words</span>
            <span>English (US)</span>
            <span>Progress: ${progress}%</span>
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

  switchTab(tabName) {
    this._activeTab = tabName;
    this._updateEmbed();
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
