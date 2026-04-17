/**
 * MOS-READY — Word Lab (MS Word Integration)
 */
const WordLabPage = {
  wordLaunched: false,

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
    document.getElementById('launch-word-btn')?.addEventListener('click', () => this.launchWord());
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
    const embedArea = document.getElementById('word-embed-area');

    try {
      // Try launching Word via server endpoint
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

    // Attempt direct launch via protocol handler
    try {
      window.open('ms-word:', '_blank');
    } catch (e) {
      // Ignore
    }

    Toast.info('Please open Microsoft Word manually. Complete tasks and check them off!');
  },

  _updateEmbed() {
    const embedArea = document.getElementById('word-embed-area');
    if (!embedArea) return;

    const completed = Storage.get('wordTasks', []);
    const progress = Math.round((completed.length / this.tasks.length) * 100);

    if (this.wordLaunched) {
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
        <div class="word-panel__embed-icon">📄</div>
        <div class="word-panel__embed-text">
          <p class="font-semibold mb-sm">Microsoft Word Integration</p>
          <p class="text-sm text-secondary">Click "Launch Microsoft Word" to open Word. Complete the practice tasks on the left panel.</p>
        </div>
      `;
    }
  }
};

window.WordLabPage = WordLabPage;
