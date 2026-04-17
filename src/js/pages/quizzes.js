/**
 * MOS-READY — Section Quizzes Page
 */
const QuizzesPage = {
  currentQuiz: null,
  currentIndex: 0,
  score: 0,
  answers: [],
  answered: false,

  init() {
    this.renderQuizSelect();
    Router.onPageEnter('quizzes', () => this.renderQuizSelect());
  },

  renderQuizSelect() {
    const container = document.getElementById('quiz-select');
    const quizArea = document.getElementById('quiz-area');
    const header = document.getElementById('quiz-header');

    if (!container) return;
    container.style.display = '';
    quizArea.style.display = 'none';
    header.style.display = '';

    container.innerHTML = LEARNING_MODULES.map(mod => {
      const questions = QUESTION_BANK[mod.id] || [];
      if (questions.length === 0) return '';

      return `
        <div class="module-card" onclick="QuizzesPage.startQuiz('${mod.id}')">
          <div class="module-card__banner" style="background:${mod.gradient}">
            ${mod.emoji}
          </div>
          <div class="module-card__body">
            <div class="module-card__title">${mod.title} Quiz</div>
            <div class="module-card__desc">Test your knowledge on ${mod.title.toLowerCase()}</div>
            <div class="module-card__footer">
              <span class="module-card__steps">${questions.length} questions</span>
              <span class="badge badge-primary">+${questions.length * 5} XP</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  startQuiz(moduleId) {
    const questions = QUESTION_BANK[moduleId];
    if (!questions || questions.length === 0) return;

    this.currentQuiz = { moduleId, questions: [...questions].sort(() => Math.random() - 0.5) };
    this.currentIndex = 0;
    this.score = 0;
    this.answers = [];
    this.answered = false;

    document.getElementById('quiz-select').style.display = 'none';
    document.getElementById('quiz-header').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'block';

    this.renderQuestion();
  },

  renderQuestion() {
    const area = document.getElementById('quiz-area');
    const q = this.currentQuiz.questions[this.currentIndex];
    const total = this.currentQuiz.questions.length;

    area.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <div class="quiz-progress">
          <span class="quiz-progress__text">Question ${this.currentIndex + 1} of ${total}</span>
          <div class="progress-bar" style="flex:1">
            <div class="progress-bar__fill" style="width:${((this.currentIndex + 1) / total) * 100}%"></div>
          </div>
          <span class="badge badge-primary">${this.score}/${this.currentIndex} correct</span>
        </div>

        <div class="quiz-question-card">
          ${q.scenario ? `<div class="quiz-question__scenario">📋 ${q.scenario}</div>` : ''}
          <div class="quiz-question__text">${q.question}</div>

          <div class="quiz-options" id="quiz-options">
            ${q.options.map((opt, i) => `
              <div class="quiz-option" data-index="${i}" onclick="QuizzesPage.selectAnswer(${i})">
                <span class="quiz-option__letter">${String.fromCharCode(65 + i)}</span>
                <span>${opt}</span>
              </div>
            `).join('')}
          </div>

          <div id="quiz-feedback"></div>
        </div>

        <div class="quiz-actions" id="quiz-actions" style="display:none">
          <button class="btn btn-primary" onclick="QuizzesPage.nextQuestion()">
            ${this.currentIndex < total - 1 ? 'Next Question →' : 'See Results 🏆'}
          </button>
        </div>
      </div>
    `;

    this.answered = false;
  },

  selectAnswer(index) {
    if (this.answered) return;
    this.answered = true;

    const q = this.currentQuiz.questions[this.currentIndex];
    const isCorrect = index === q.correct;

    if (isCorrect) this.score++;
    this.answers.push({ question: q, selected: index, correct: isCorrect });

    // Highlight options
    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
      if (i === q.correct) opt.classList.add('correct');
      if (i === index && !isCorrect) opt.classList.add('incorrect');
      if (i === index) opt.classList.add('selected');
    });

    // Show feedback
    const feedback = document.getElementById('quiz-feedback');
    if (isCorrect) {
      feedback.innerHTML = `
        <div class="quiz-feedback quiz-feedback--correct">
          ✅ Correct! ${q.explanation}
        </div>
      `;
    } else {
      feedback.innerHTML = `
        <div class="quiz-feedback quiz-feedback--incorrect">
          ❌ Not quite. ${q.explanation}
        </div>
      `;
    }

    document.getElementById('quiz-actions').style.display = 'flex';
  },

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.currentQuiz.questions.length) {
      this.renderQuestion();
    } else {
      this.showResults();
    }
  },

  showResults() {
    const area = document.getElementById('quiz-area');
    const total = this.currentQuiz.questions.length;
    const percent = Math.round((this.score / total) * 100);
    const xpEarned = this.score * 5 + (percent === 100 ? 20 : 0);

    // Award XP
    XP.award(xpEarned, `Quiz: ${this.score}/${total} correct`);
    Storage.setQuizzesCompleted(Storage.getQuizzesCompleted() + 1);
    Storage.addActivity({
      type: 'quiz',
      text: `Scored ${this.score}/${total} (${percent}%) on quiz`
    });

    if (percent >= 80) Confetti.burst();

    const message = percent === 100 ? '🏆 Perfect Score!' :
                    percent >= 80 ? '🎉 Amazing!' :
                    percent >= 60 ? '👍 Good Job!' :
                    percent >= 40 ? '📚 Keep Studying!' : '💪 Don\'t Give Up!';

    area.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-results animate-scale-in">
          <div style="font-size:80px;margin-bottom:var(--space-lg)">${percent >= 80 ? '🏆' : percent >= 60 ? '⭐' : '📚'}</div>
          <div class="quiz-results__message">${message}</div>
          <div style="font-size:var(--text-3xl);font-weight:800;margin:var(--space-md) 0;font-family:var(--font-display)">
            ${this.score} / ${total}
          </div>
          <div style="font-size:var(--text-xl);color:var(--text-secondary);margin-bottom:var(--space-md)">${percent}%</div>
          <div class="quiz-results__xp">+${xpEarned} XP</div>

          <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="QuizzesPage.startQuiz('${this.currentQuiz.moduleId}')">
              Retry Quiz 🔄
            </button>
            <button class="btn btn-secondary" onclick="QuizzesPage.renderQuizSelect()">
              All Quizzes
            </button>
            <button class="btn btn-ghost" onclick="QuizzesPage.showReview()">
              Review Answers 📋
            </button>
          </div>
        </div>
      </div>
    `;
  },

  showReview() {
    const area = document.getElementById('quiz-area');

    area.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <div class="lesson-breadcrumb" onclick="QuizzesPage.renderQuizSelect()" style="cursor:pointer;margin-bottom:var(--space-lg)">
          ← Back to Quizzes
        </div>
        <h3 class="heading-3 mb-lg">📋 Answer Review</h3>
        ${this.answers.map((a, i) => `
          <div class="glass-card mb-md" style="border-left:3px solid ${a.correct ? 'var(--accent-cyan)' : 'var(--accent-pink)'}">
            <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm)">
              <span>${a.correct ? '✅' : '❌'}</span>
              <span class="font-bold">Question ${i + 1}</span>
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
  }
};

window.QuizzesPage = QuizzesPage;
