/**
 * MOS-READY — Custom Resources Page
 * Upload/paste notes → auto-generate quizzes from content
 */
const ResourcesPage = {
  init() {
    // Upload zone click
    document.getElementById('resource-upload-zone')?.addEventListener('click', () => {
      document.getElementById('resource-file-input')?.click();
    });

    // File input change
    document.getElementById('resource-file-input')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) this.readFile(file);
    });

    // Drag and drop
    const uploadZone = document.getElementById('resource-upload-zone');
    if (uploadZone) {
      uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary-500)';
      });
      uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '';
      });
      uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file) this.readFile(file);
      });
    }

    // Analyze button
    document.getElementById('analyze-resource-btn')?.addEventListener('click', () => {
      const text = document.getElementById('resource-paste-area')?.value;
      if (text && text.trim().length > 20) {
        this.analyzeContent(text.trim(), 'Pasted Notes');
      } else {
        Toast.error('Please paste at least a few sentences of study material');
      }
    });

    Router.onPageEnter('resources', () => this.renderResources());
  },

  readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (text && text.length > 20) {
        this.analyzeContent(text, file.name);
      } else {
        Toast.error('File appears empty or too short');
      }
    };
    reader.readAsText(file);
  },

  analyzeContent(text, title) {
    Toast.info('Analyzing your content...');

    // Extract keywords and concepts
    const keywords = this._extractKeywords(text);
    const questions = this._generateQuestions(text, keywords);

    const resource = {
      id: Date.now(),
      title,
      excerpt: text.substring(0, 150) + '...',
      keywords,
      questions,
      createdAt: Date.now()
    };

    Storage.addResource(resource);
    XP.award(15, 'Added study resource');
    Storage.addActivity({ type: 'learn', text: `Added resource: ${title}` });

    Toast.success(`Generated ${questions.length} quiz questions from your material!`);
    this.renderResources();

    // Clear paste area
    const pasteArea = document.getElementById('resource-paste-area');
    if (pasteArea) pasteArea.value = '';
  },

  _extractKeywords(text) {
    // Simple keyword extraction based on word frequency and length
    const words = text.toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4);

    const stopWords = new Set(['about', 'after', 'again', 'being', 'between', 'could', 'would',
      'should', 'their', 'there', 'these', 'those', 'through', 'under', 'which', 'while',
      'other', 'where', 'using', 'above', 'below', 'within', 'before', 'during']);

    const freq = {};
    words.forEach(w => {
      if (!stopWords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  },

  _generateQuestions(text, keywords) {
    // Parse sentences and generate fill-in-the-blank and true/false questions
    const sentences = text
      .replace(/\n/g, '. ')
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 20 && s.trim().length < 200)
      .map(s => s.trim());

    const questions = [];

    // Generate questions from keyword-containing sentences
    const kwSentences = sentences.filter(s => {
      const lower = s.toLowerCase();
      return keywords.some(kw => lower.includes(kw));
    });

    // Take up to 8 sentences for questions
    const selected = kwSentences.slice(0, 8);

    selected.forEach((sentence, i) => {
      // Find a keyword in this sentence
      const lower = sentence.toLowerCase();
      const keyword = keywords.find(kw => lower.includes(kw));
      if (!keyword) return;

      // Create a multiple choice question
      const wrongAnswers = keywords.filter(k => k !== keyword).slice(0, 3);
      while (wrongAnswers.length < 3) {
        wrongAnswers.push(['process', 'method', 'feature', 'option', 'setting'][wrongAnswers.length]);
      }

      const options = [keyword, ...wrongAnswers].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(keyword);

      // Create the question by blanking out the keyword
      const regex = new RegExp(keyword, 'i');
      const blanked = sentence.replace(regex, '_____');

      questions.push({
        id: `custom-${Date.now()}-${i}`,
        type: 'mc',
        question: `Fill in the blank: "${blanked}"`,
        options,
        correct: correctIndex,
        explanation: `The correct answer is "${keyword}" — from your study material.`,
        hint: `This word is related to the concept discussed in your notes.`
      });
    });

    // If not enough, add true/false style questions
    if (questions.length < 5 && sentences.length > 0) {
      sentences.slice(0, 5 - questions.length).forEach((sentence, i) => {
        questions.push({
          id: `custom-tf-${Date.now()}-${i}`,
          type: 'mc',
          question: `True or False: "${sentence}"`,
          options: ['True', 'False', 'Partially True', 'Not enough information'],
          correct: 0,
          explanation: 'This statement comes directly from your study material.',
          hint: 'Think about what your study notes said.'
        });
      });
    }

    return questions;
  },

  renderResources() {
    const container = document.getElementById('resource-list');
    if (!container) return;

    const resources = Storage.getResources();

    if (resources.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = resources.map(r => `
      <div class="resource-item">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-sm)">
          <span class="font-semibold">📄 ${r.title}</span>
          <span class="text-xs text-tertiary">${new Date(r.createdAt).toLocaleDateString()}</span>
        </div>
        <p class="text-sm text-secondary mb-md" style="line-height:1.5">${r.excerpt}</p>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:var(--space-md)">
          ${r.keywords.slice(0, 5).map(kw => `<span class="badge badge-primary">${kw}</span>`).join('')}
        </div>
        <div style="display:flex;gap:var(--space-sm)">
          <button class="btn btn-primary btn-sm" onclick="ResourcesPage.takeQuiz(${r.id})">
            Take Quiz (${r.questions.length} Q)
          </button>
          <button class="btn btn-ghost btn-sm" onclick="ResourcesPage.deleteResource(${r.id})">
            🗑️ Delete
          </button>
        </div>
      </div>
    `).join('');
  },

  takeQuiz(resourceId) {
    const resources = Storage.getResources();
    const resource = resources.find(r => r.id === resourceId);
    if (!resource || resource.questions.length === 0) {
      Toast.error('No questions available for this resource');
      return;
    }

    // Navigate to quizzes and start a custom quiz
    Router.navigate('quizzes');
    setTimeout(() => {
      // Inject custom quiz
      QuizzesPage.currentQuiz = {
        moduleId: 'custom-' + resourceId,
        questions: [...resource.questions].sort(() => Math.random() - 0.5)
      };
      QuizzesPage.currentIndex = 0;
      QuizzesPage.score = 0;
      QuizzesPage.answers = [];
      QuizzesPage.answered = false;

      document.getElementById('quiz-select').style.display = 'none';
      document.getElementById('quiz-header').style.display = 'none';
      document.getElementById('quiz-area').style.display = 'block';

      QuizzesPage.renderQuestion();
    }, 100);
  },

  deleteResource(resourceId) {
    if (!confirm('Delete this resource?')) return;
    const resources = Storage.getResources().filter(r => r.id !== resourceId);
    Storage.setResources(resources);
    this.renderResources();
    Toast.info('Resource deleted');
  }
};

window.ResourcesPage = ResourcesPage;
