/**
 * MOS-READY — Mock Exam Page
 * 20-question non-repeating mock exams with hints
 */
const MockExamPage = {
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  answered: false,
  hintUsed: false,
  sessionId: null,

  init() {
    document.getElementById('start-mock-btn')?.addEventListener('click', () => this.startExam());
    Router.onPageEnter('mock-exam', () => this.renderLanding());
  },

  renderLanding() {
    document.getElementById('mock-start').style.display = '';
    document.getElementById('mock-quiz-area').style.display = 'none';
    document.getElementById('mock-header').style.display = '';
    this.renderHistory();
  },

  renderHistory() {
    const container = document.getElementById('mock-history');
    const history = Storage.getMockHistory();

    if (!container) return;

    if (history.length === 0) {
      container.innerHTML = `
        <div class="activity-item" style="opacity:0.5">
          <div class="activity-item__icon" style="background:var(--bg-glass)">📭</div>
          <div class="activity-item__text">No mock exams taken yet</div>
        </div>
      `;
      return;
    }

    container.innerHTML = history.map((session, i) => {
      const date = new Date(session.date).toLocaleDateString();
      const percent = Math.round((session.score / session.total) * 100);
      return `
        <div class="exam-history-item" onclick="MockExamPage.reviewSession(${i})">
          <div style="display:flex;align-items:center;gap:var(--space-md)">
            <span style="font-size:24px">${percent >= 80 ? '🏆' : percent >= 60 ? '⭐' : '📝'}</span>
            <div>
              <div class="font-semibold">Mock Exam — ${date}</div>
              <div class="text-sm text-secondary">${session.score}/${session.total} correct (${percent}%)</div>
            </div>
          </div>
          <span class="badge ${percent >= 80 ? 'badge-success' : percent >= 60 ? 'badge-warning' : 'badge-danger'}">${percent}%</span>
        </div>
      `;
    }).join('');
  },

  startExam() {
    // Gather all available questions
    const allQuestions = [
      ...MOCK_EXAM_QUESTIONS,
      ...Object.values(QUESTION_BANK).flat()
    ];

    // Filter out already used in this session
    const usedIds = Storage.getUsedMockQuestions();
    let available = allQuestions.filter(q => !usedIds.includes(q.id));

    // If not enough, reset
    if (available.length < 20) {
      Storage.resetUsedMockQuestions();
      available = allQuestions;
    }

    // Pick 20 random
    this.questions = [...available].sort(() => Math.random() - 0.5).slice(0, 20);

    // Mark as used
    const newUsed = [...usedIds, ...this.questions.map(q => q.id)];
    Storage.setUsedMockQuestions(newUsed);

    this.currentIndex = 0;
    this.score = 0;
    this.answers = [];
    this.sessionId = Date.now();

    document.getElementById('mock-start').style.display = 'none';
    document.getElementById('mock-header').style.display = 'none';
    document.getElementById('mock-quiz-area').style.display = 'block';

    this.renderQuestion();
  },

  renderQuestion() {
    const area = document.getElementById('mock-quiz-area');
    const q = this.questions[this.currentIndex];
    const total = this.questions.length;
    this.answered = false;
    this.hintUsed = false;

    area.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <div class="lesson-breadcrumb" onclick="MockExamPage.confirmExit()" style="cursor:pointer;margin-bottom:var(--space-md)">
          ← Exit Mock Exam
        </div>

        <div class="mock-exam-header">
          <div class="quiz-progress" style="flex:1">
            <span class="quiz-progress__text">Question ${this.currentIndex + 1}/${total}</span>
            <div class="progress-bar" style="flex:1">
              <div class="progress-bar__fill" style="width:${((this.currentIndex + 1) / total) * 100}%"></div>
            </div>
          </div>
          <span class="badge badge-primary" style="margin-left:var(--space-md)">Score: ${this.score}</span>
        </div>

        <div class="quiz-question-card">
          ${q.scenario ? `<div class="quiz-question__scenario">📋 ${q.scenario}</div>` : ''}
          <div class="quiz-question__text">${q.question}</div>

          <div style="margin-bottom:var(--space-md)">
            <button class="hint-btn" id="hint-btn" onclick="MockExamPage.showHint()">
              💡 Show Hint
            </button>
            <div id="hint-area"></div>
          </div>

          <div class="quiz-options" id="mock-options">
            ${q.options.map((opt, i) => `
              <div class="quiz-option" data-index="${i}" onclick="MockExamPage.selectAnswer(${i})">
                <span class="quiz-option__letter">${String.fromCharCode(65 + i)}</span>
                <span>${opt}</span>
              </div>
            `).join('')}
          </div>

          <div id="mock-feedback"></div>
        </div>

        <div class="quiz-actions" id="mock-actions" style="display:none">
          <button class="btn btn-primary" onclick="MockExamPage.nextQuestion()">
            ${this.currentIndex < total - 1 ? 'Next Question →' : 'See Results 🏆'}
          </button>
        </div>
      </div>
    `;
  },

  showHint() {
    const q = this.questions[this.currentIndex];
    const hintArea = document.getElementById('hint-area');
    const hintBtn = document.getElementById('hint-btn');

    if (hintArea && q.hint) {
      hintArea.innerHTML = `<div class="hint-text">💡 ${q.hint}</div>`;
      hintBtn.style.display = 'none';
      this.hintUsed = true;
    }
  },

  selectAnswer(index) {
    if (this.answered) return;
    this.answered = true;

    const q = this.questions[this.currentIndex];
    const isCorrect = index === q.correct;

    if (isCorrect) this.score++;
    this.answers.push({ question: q, selected: index, correct: isCorrect, hintUsed: this.hintUsed });

    document.querySelectorAll('#mock-options .quiz-option').forEach((opt, i) => {
      if (i === q.correct) opt.classList.add('correct');
      if (i === index && !isCorrect) opt.classList.add('incorrect');
      if (i === index) opt.classList.add('selected');
    });

    const feedback = document.getElementById('mock-feedback');
    feedback.innerHTML = `
      <div class="quiz-feedback quiz-feedback--${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? '✅ Correct!' : '❌ Incorrect.'} ${q.explanation}
      </div>
    `;

    document.getElementById('mock-actions').style.display = 'flex';
  },

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.renderQuestion();
    } else {
      this.showResults();
    }
  },

  showResults() {
    const total = this.questions.length;
    const percent = Math.round((this.score / total) * 100);
    const xpEarned = this.score * 5 + (percent >= 80 ? 30 : 0);

    // Save session
    Storage.addMockSession({
      id: this.sessionId,
      date: Date.now(),
      score: this.score,
      total,
      answers: this.answers.map(a => ({
        questionId: a.question.id,
        question: a.question.question,
        selected: a.selected,
        correct: a.correct,
        correctAnswer: a.question.options[a.question.correct],
        hintUsed: a.hintUsed
      }))
    });

    XP.award(xpEarned, `Mock Exam: ${this.score}/${total}`);
    Storage.setQuizzesCompleted(Storage.getQuizzesCompleted() + 1);
    Storage.addActivity({ type: 'quiz', text: `Mock Exam: ${this.score}/${total} (${percent}%)` });

    if (percent >= 80) Confetti.burst();

    const area = document.getElementById('mock-quiz-area');
    const message = percent >= 90 ? '🏆 Outstanding!' :
                    percent >= 80 ? '🎉 Excellent!' :
                    percent >= 70 ? '👍 Great Job!' :
                    percent >= 60 ? '⭐ Good Effort!' : '📚 Keep Practicing!';

    area.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-results animate-scale-in">
          <div style="font-size:80px;margin-bottom:var(--space-lg)">${percent >= 80 ? '🏆' : '📝'}</div>
          <div class="quiz-results__message">${message}</div>
          <div style="font-size:var(--text-3xl);font-weight:800;margin:var(--space-md) 0;font-family:var(--font-display)">
            ${this.score} / ${total}
          </div>
          <div style="font-size:var(--text-xl);color:var(--text-secondary);margin-bottom:var(--space-md)">${percent}%</div>
          <div class="quiz-results__xp">+${xpEarned} XP</div>

          <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;margin-top:var(--space-xl)">
            <button class="btn btn-primary" onclick="MockExamPage.startExam()">New Mock Exam 🔄</button>
            <button class="btn btn-secondary" onclick="MockExamPage.renderLanding()">Back</button>
            <button class="btn btn-ghost" onclick="MockExamPage.reviewCurrent()">Review Answers 📋</button>
          </div>
        </div>
      </div>
    `;
  },

  reviewCurrent() {
    const area = document.getElementById('mock-quiz-area');
    area.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <div class="lesson-breadcrumb" onclick="MockExamPage.renderLanding()" style="cursor:pointer;margin-bottom:var(--space-lg)">
          ← Back to Mock Exam
        </div>
        <h3 class="heading-3 mb-lg">📋 Mock Exam Review</h3>
        ${this.answers.map((a, i) => `
          <div class="glass-card mb-md" style="border-left:3px solid ${a.correct ? 'var(--accent-cyan)' : 'var(--accent-pink)'}">
            <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm)">
              <span>${a.correct ? '✅' : '❌'}</span>
              <span class="font-bold">Q${i + 1}</span>
              ${a.hintUsed ? '<span class="badge badge-warning" style="font-size:0.65rem">Hint used</span>' : ''}
            </div>
            <p style="margin-bottom:var(--space-sm)">${a.question.question}</p>
            <p class="text-sm" style="color:${a.correct ? 'var(--accent-cyan)' : 'var(--accent-pink)'}">
              Your answer: ${a.question.options[a.selected]}
            </p>
            ${!a.correct ? `<p class="text-sm" style="color:var(--accent-cyan)">Correct: ${a.question.options[a.question.correct]}</p>` : ''}
            <p class="text-sm text-secondary mt-sm">${a.question.explanation}</p>
          </div>
        `).join('')}
      </div>
    `;
  },

  reviewSession(historyIndex) {
    const history = Storage.getMockHistory();
    const session = history[historyIndex];
    if (!session) return;

    document.getElementById('mock-start').style.display = 'none';
    document.getElementById('mock-header').style.display = 'none';
    document.getElementById('mock-quiz-area').style.display = 'block';

    const area = document.getElementById('mock-quiz-area');
    const date = new Date(session.date).toLocaleDateString();
    const percent = Math.round((session.score / session.total) * 100);

    area.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <div class="lesson-breadcrumb" onclick="MockExamPage.renderLanding()" style="cursor:pointer;margin-bottom:var(--space-lg)">
          ← Back to Mock Exam
        </div>
        <h3 class="heading-3 mb-sm">📋 Mock Exam — ${date}</h3>
        <p class="text-secondary mb-lg">Score: ${session.score}/${session.total} (${percent}%)</p>

        ${session.answers.map((a, i) => `
          <div class="glass-card mb-md" style="border-left:3px solid ${a.correct ? 'var(--accent-cyan)' : 'var(--accent-pink)'}">
            <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm)">
              <span>${a.correct ? '✅' : '❌'}</span>
              <span class="font-bold">Q${i + 1}</span>
              ${a.hintUsed ? '<span class="badge badge-warning" style="font-size:0.65rem">Hint used</span>' : ''}
            </div>
            <p style="margin-bottom:var(--space-sm)">${a.question}</p>
            <p class="text-sm" style="color:${a.correct ? 'var(--accent-cyan)' : 'var(--accent-pink)'}">
              Your answer: ${a.correctAnswer ? '' : ''}${a.correct ? a.correctAnswer : 'Incorrect'}
            </p>
            ${!a.correct ? `<p class="text-sm" style="color:var(--accent-cyan)">Correct: ${a.correctAnswer}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  confirmExit() {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
      this.renderLanding();
    }
  }
};

window.MockExamPage = MockExamPage;
