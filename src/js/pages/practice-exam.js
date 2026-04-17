/**
 * MOS-READY — Practice Exam (Paid Feature)
 * 40 questions, 50 min timer, 2 attempts per payment (₦250 via Paystack)
 */
const PracticeExamPage = {
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  answered: false,
  timer: null,
  timeLeft: 50 * 60, // 50 minutes in seconds

  init() {
    document.getElementById('pay-btn')?.addEventListener('click', () => this.initiatePayment());
    document.getElementById('start-practice-btn')?.addEventListener('click', () => this.startExam());
    Router.onPageEnter('practice-exam', () => this.renderLanding());
  },

  renderLanding() {
    document.getElementById('practice-exam-landing').style.display = '';
    document.getElementById('practice-exam-area').style.display = 'none';
    this.updateAttemptUI();
  },

  updateAttemptUI() {
    const attempts = Storage.getPracticeAttempts();
    const paid = Storage.getPracticePaid();
    const attemptsLeft = paid ? Math.max(0, 2 - attempts) : 0;

    const dot1 = document.getElementById('attempt-1');
    const dot2 = document.getElementById('attempt-2');
    const label = document.getElementById('attempts-left');
    const payBtn = document.getElementById('pay-btn');
    const startBtn = document.getElementById('start-practice-btn');

    if (dot1) {
      dot1.className = 'attempt-dot ' + (attempts >= 1 ? 'used' : (paid ? 'available' : ''));
    }
    if (dot2) {
      dot2.className = 'attempt-dot ' + (attempts >= 2 ? 'used' : (paid ? 'available' : ''));
    }

    if (label) {
      label.textContent = paid ? `${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining` : 'No attempts available';
    }

    if (payBtn && startBtn) {
      if (paid && attemptsLeft > 0) {
        payBtn.style.display = 'none';
        startBtn.style.display = '';
      } else if (paid && attemptsLeft === 0) {
        payBtn.textContent = '💳 Pay ₦250 for 2 More Attempts';
        payBtn.style.display = '';
        startBtn.style.display = 'none';
      } else {
        payBtn.style.display = '';
        startBtn.style.display = 'none';
      }
    }
  },

  initiatePayment() {
    // Paystack integration
    // In production, payment would be verified server-side
    // The Paystack public key and account details are handled server-side for security

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
      <div class="modal__header">
        <span class="modal__title">💳 Payment</span>
        <button class="btn btn-ghost btn-icon" onclick="document.getElementById('modal-overlay').classList.remove('active')">✕</button>
      </div>
      <div style="text-align:center">
        <div style="font-size:48px;margin-bottom:var(--space-md)">💳</div>
        <h3 class="heading-3 mb-sm">Complete Practice Exam</h3>
        <p class="text-secondary mb-lg">2 exam attempts for ₦250</p>

        <div class="glass-card mb-lg" style="text-align:left">
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-sm)">
            <span>Practice Exam (2 attempts)</span>
            <span class="font-bold">₦250</span>
          </div>
          <hr style="border:none;border-top:1px solid var(--border-subtle);margin:var(--space-sm) 0">
          <div style="display:flex;justify-content:space-between">
            <span class="font-bold">Total</span>
            <span class="font-bold text-gradient">₦250.00</span>
          </div>
        </div>

        <div style="margin-bottom:var(--space-lg)">
          <input type="email" id="payment-email" placeholder="Your email address"
            style="width:100%;margin-bottom:var(--space-sm)">
        </div>

        <button class="btn btn-primary btn-lg w-full" id="confirm-payment-btn" onclick="PracticeExamPage.processPayment()">
          Pay ₦250 with Card 💳
        </button>
        <p class="text-xs text-tertiary mt-md">Secured by Paystack • Card payment</p>
      </div>
    `;

    modal.classList.add('active');
  },

  async processPayment() {
    const email = document.getElementById('payment-email')?.value;
    if (!email || !email.includes('@')) {
      Toast.error('Please enter a valid email address');
      return;
    }

    const confirmBtn = document.getElementById('confirm-payment-btn');
    confirmBtn.textContent = 'Processing...';
    confirmBtn.disabled = true;

    try {
      // Call server to initialize payment
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount: 25000 }) // Amount in kobo (₦250 = 25000 kobo)
      });

      const data = await response.json();

      if (data.success && data.authorization_url) {
        // Redirect to Paystack payment page
        window.open(data.authorization_url, '_blank');

        // Show verification UI
        const content = document.getElementById('modal-content');
        content.innerHTML = `
          <div style="text-align:center;padding:var(--space-lg)">
            <div style="font-size:48px;margin-bottom:var(--space-md)" class="animate-float">🔄</div>
            <h3 class="heading-3 mb-sm">Complete Payment</h3>
            <p class="text-secondary mb-lg">A payment window has opened. Complete the payment there, then click verify below.</p>
            <button class="btn btn-primary btn-lg w-full" onclick="PracticeExamPage.verifyPayment('${data.reference}')">
              ✅ I've Completed Payment — Verify
            </button>
            <button class="btn btn-ghost mt-md" onclick="document.getElementById('modal-overlay').classList.remove('active')">
              Cancel
            </button>
          </div>
        `;
      } else {
        // Fallback: simulate payment for demo/offline mode
        this._simulatePayment();
      }
    } catch (error) {
      // Server not available — simulate payment for demo
      this._simulatePayment();
    }
  },

  _simulatePayment() {
    // Demo mode: simulate successful payment
    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <div style="text-align:center;padding:var(--space-lg)">
        <div style="font-size:48px;margin-bottom:var(--space-md)" class="animate-float">🔄</div>
        <h3 class="heading-3 mb-sm">Demo Mode</h3>
        <p class="text-secondary mb-lg">Payment server not available. Click below to simulate a successful payment for testing.</p>
        <button class="btn btn-primary btn-lg w-full" onclick="PracticeExamPage.confirmPaymentSuccess()">
          ✅ Simulate Successful Payment
        </button>
        <button class="btn btn-ghost mt-md" onclick="document.getElementById('modal-overlay').classList.remove('active')">
          Cancel
        </button>
      </div>
    `;
  },

  async verifyPayment(reference) {
    try {
      const response = await fetch(`/api/payment/verify/${reference}`);
      const data = await response.json();

      if (data.success) {
        this.confirmPaymentSuccess();
      } else {
        Toast.error('Payment not confirmed. Please try again.');
      }
    } catch {
      Toast.error('Could not verify payment. Please contact support.');
    }
  },

  confirmPaymentSuccess() {
    Storage.setPracticePaid(true);
    Storage.setPracticeAttempts(0);

    document.getElementById('modal-overlay').classList.remove('active');
    Toast.success('🎉 Payment successful! You have 2 practice exam attempts.');
    Confetti.burst();

    this.updateAttemptUI();
  },

  startExam() {
    const attempts = Storage.getPracticeAttempts();
    if (attempts >= 2) {
      Toast.error('No attempts remaining. Please purchase more.');
      return;
    }

    // Use one attempt
    Storage.setPracticeAttempts(attempts + 1);

    // Select 40 unique questions
    const allQs = [...PRACTICE_EXAM_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 40);
    this.questions = allQs;
    this.currentIndex = 0;
    this.score = 0;
    this.answers = [];
    this.timeLeft = 50 * 60;

    document.getElementById('practice-exam-landing').style.display = 'none';
    document.getElementById('practice-exam-area').style.display = 'block';

    // Start timer
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      this._updateTimer();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.showResults();
      }
    }, 1000);

    this.renderQuestion();
  },

  _updateTimer() {
    const timerEl = document.getElementById('practice-timer');
    if (!timerEl) return;

    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (this.timeLeft <= 300) { // 5 min warning
      timerEl.parentElement.classList.add('warning');
    }
  },

  renderQuestion() {
    const area = document.getElementById('practice-exam-area');
    const q = this.questions[this.currentIndex];
    const total = this.questions.length;
    this.answered = false;

    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;

    area.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <div class="mock-exam-header">
          <div class="quiz-progress" style="flex:1">
            <span class="quiz-progress__text">Q${this.currentIndex + 1}/${total}</span>
            <div class="progress-bar" style="flex:1">
              <div class="progress-bar__fill" style="width:${((this.currentIndex + 1) / total) * 100}%"></div>
            </div>
          </div>
          <div class="mock-exam-timer ${this.timeLeft <= 300 ? 'warning' : ''}">
            ⏱️ <span id="practice-timer">${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div class="quiz-question-card">
          ${q.scenario ? `<div class="quiz-question__scenario">📋 ${q.scenario}</div>` : ''}
          <div class="quiz-question__text">${q.question}</div>

          <div class="quiz-options" id="practice-options">
            ${q.options.map((opt, i) => `
              <div class="quiz-option" data-index="${i}" onclick="PracticeExamPage.selectAnswer(${i})">
                <span class="quiz-option__letter">${String.fromCharCode(65 + i)}</span>
                <span>${opt}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="quiz-actions">
          <span class="text-sm text-secondary">Score so far: ${this.score}/${this.currentIndex}</span>
          <button class="btn btn-primary" id="practice-next-btn" onclick="PracticeExamPage.nextQuestion()" disabled>
            ${this.currentIndex < total - 1 ? 'Next →' : 'Finish Exam'}
          </button>
        </div>
      </div>
    `;
  },

  selectAnswer(index) {
    if (this.answered) return;
    this.answered = true;

    const q = this.questions[this.currentIndex];
    const isCorrect = index === q.correct;
    if (isCorrect) this.score++;

    this.answers.push({ question: q, selected: index, correct: isCorrect });

    // Highlight
    document.querySelectorAll('#practice-options .quiz-option').forEach((opt, i) => {
      if (i === index) opt.classList.add('selected');
    });

    // Enable next
    const nextBtn = document.getElementById('practice-next-btn');
    if (nextBtn) nextBtn.disabled = false;
  },

  nextQuestion() {
    if (!this.answered) return;
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.renderQuestion();
    } else {
      clearInterval(this.timer);
      this.showResults();
    }
  },

  showResults() {
    if (this.timer) clearInterval(this.timer);

    const total = this.questions.length;
    const answered = this.answers.length;
    const percent = Math.round((this.score / total) * 100);
    const timeUsed = (50 * 60) - this.timeLeft;
    const minsUsed = Math.floor(timeUsed / 60);
    const secsUsed = timeUsed % 60;

    Storage.addActivity({ type: 'quiz', text: `Practice Exam: ${this.score}/${total} (${percent}%)` });

    if (percent >= 70) {
      XP.award(100, `Practice Exam: ${percent}%`);
      Confetti.burst();
    } else {
      XP.award(30, `Practice Exam completed`);
    }

    const area = document.getElementById('practice-exam-area');
    const pass = percent >= 70;

    area.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-results animate-scale-in">
          <div style="font-size:80px;margin-bottom:var(--space-lg)">${pass ? '🏆' : '📋'}</div>
          <div class="quiz-results__message">${pass ? 'You Passed!' : 'Keep Practicing!'}</div>
          <div style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-md)">
            ${pass ? 'You would likely pass the real MOS Word exam!' : 'The passing threshold is typically 70%. Keep studying!'}
          </div>
          <div style="font-size:var(--text-3xl);font-weight:800;margin:var(--space-md) 0;font-family:var(--font-display)">
            ${this.score} / ${total}
          </div>
          <div style="font-size:var(--text-xl);color:var(--text-secondary);margin-bottom:var(--space-sm)">${percent}%</div>
          <div class="text-sm text-secondary mb-lg">
            Answered: ${answered}/${total} • Time: ${minsUsed}m ${secsUsed}s
          </div>

          <div class="quiz-results__xp">+${percent >= 70 ? 100 : 30} XP</div>

          <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;margin-top:var(--space-xl)">
            <button class="btn btn-secondary" onclick="PracticeExamPage.renderLanding()">Back</button>
            <button class="btn btn-ghost" onclick="PracticeExamPage.reviewAnswers()">Review Answers 📋</button>
          </div>
        </div>
      </div>
    `;
  },

  reviewAnswers() {
    const area = document.getElementById('practice-exam-area');
    area.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <div class="lesson-breadcrumb" onclick="PracticeExamPage.renderLanding()" style="cursor:pointer;margin-bottom:var(--space-lg)">
          ← Back
        </div>
        <h3 class="heading-3 mb-lg">📋 Practice Exam Review</h3>
        ${this.answers.map((a, i) => `
          <div class="glass-card mb-md" style="border-left:3px solid ${a.correct ? 'var(--accent-cyan)' : 'var(--accent-pink)'}">
            <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm)">
              <span>${a.correct ? '✅' : '❌'}</span>
              <span class="font-bold">Q${i + 1}</span>
            </div>
            ${a.question.scenario ? `<p class="text-sm text-tertiary mb-sm" style="font-style:italic">📋 ${a.question.scenario}</p>` : ''}
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

window.PracticeExamPage = PracticeExamPage;
