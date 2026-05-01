/**
 * MOS-READY — Community Q&A Forum
 */
window.QaForumPage = {
  questions: [
    {
      id: 1,
      title: 'How do you accurately change margins to Narrow?',
      desc: 'I am taking the practice exam but I can\'t find the narrow margin option.',
      user: 'NoviceUser',
      time: '2 hours ago',
      answers: [
        { text: 'Go to the Layout tab on the Ribbon, click Margins, and select Narrow (0.5 inches all sides).', user: 'CertExpert' }
      ]
    },
    {
      id: 2,
      title: 'What is the quickest shortcut to create a page break?',
      desc: 'Is there a keyboard shortcut in Microsoft Word?',
      user: 'RookieLearner',
      time: '5 hours ago',
      answers: [
        { text: 'Press Ctrl+Enter together to immediately insert a page break.', user: 'MOSMaster' }
      ]
    }
  ],

  init() {
    // Merge existing storage or initialize
    const saved = localStorage.getItem('mos_qa_pool');
    if (saved) {
      try {
        this.questions = JSON.parse(saved);
      } catch (e) {
        // Fallback to defaults
      }
    } else {
      localStorage.setItem('mos_qa_pool', JSON.stringify(this.questions));
    }

    if (window.Router) {
      Router.onPageEnter('qa-forum', () => {
        this.renderPool();
      });
    }
  },

  askQuestion() {
    const title = document.getElementById('qa-new-title');
    const desc = document.getElementById('qa-new-desc');
    if (!title || !desc) return;
    const t = title.value.trim();
    const d = desc.value.trim();
    if (!t) { if (window.Toast) Toast.error('Please add a valid question title.'); return; }

    const newQ = {
      id: Date.now(),
      title: t,
      desc: d || 'Concept related to Word.',
      user: 'Student',
      time: 'Just now',
      answers: []
    };

    this.questions.unshift(newQ);
    localStorage.setItem('mos_qa_pool', JSON.stringify(this.questions));
    title.value = '';
    desc.value = '';
    if (window.Toast) Toast.success('Question added to community pool!');
    this.renderPool();
  },

  addAnswer(id) {
    const textarea = document.getElementById(`qa-ans-input-${id}`);
    if (!textarea) return;
    const ans = textarea.value.trim();
    if (!ans) { if (window.Toast) Toast.error('Please enter a valid response.'); return; }

    const q = this.questions.find(item => item.id === id);
    if (q) {
      q.answers.push({ text: ans, user: 'You' });
      localStorage.setItem('mos_qa_pool', JSON.stringify(this.questions));
      textarea.value = '';
      if (window.Toast) Toast.success('Your answer has been posted!');
      this.renderPool();
    }
  },

  renderPool() {
    const listEl = document.getElementById('qa-pool-list');
    if (!listEl) return;

    if (this.questions.length === 0) {
      listEl.innerHTML = '<p style="text-align:center;opacity:0.5;padding:20px">No questions posted yet. Be the first to ask!</p>';
      return;
    }

    let html = '';
    this.questions.forEach(q => {
      let answersHTML = '';
      if (q.answers.length > 0) {
        answersHTML += '<div style="margin-top:12px;background:rgba(255,255,255,0.03);border-radius:6px;padding:12px;display:flex;flex-direction:column;gap:8px">';
        q.answers.forEach(ans => {
          answersHTML += `
            <div style="border-left:2px solid var(--accent-cyan);padding-left:10px;font-size:13px">
              <p style="margin-bottom:2px;font-weight:600;color:var(--accent-cyan)">💬 ${this._esc(ans.user)} replied:</p>
              <p style="opacity:0.85;line-height:1.5">${this._esc(ans.text)}</p>
            </div>
          `;
        });
        answersHTML += '</div>';
      }

      html += `
        <div class="glass-card animate-fade-in" style="padding:18px;border-left:3px solid var(--accent-purple)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <h4 style="font-size:16px;color:white;margin:0;font-weight:700">${this._esc(q.title)}</h4>
            <span style="font-size:11px;opacity:0.5">👤 ${this._esc(q.user)} · ${this._esc(q.time)}</span>
          </div>
          <p style="opacity:0.8;font-size:13px;line-height:1.6;margin-bottom:12px">${this._esc(q.desc)}</p>
          ${answersHTML}

          <!-- Post answer reply -->
          <div style="display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap">
            <input type="text" id="qa-ans-input-${q.id}" placeholder="Write your exact answer here..."
              style="flex:1;min-width:240px;padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:#0b1120;color:white;font-size:13px">
            <button class="btn btn-secondary btn-sm" onclick="QaForumPage.addAnswer(${q.id})">Post Answer</button>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  },

  _esc(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
};
