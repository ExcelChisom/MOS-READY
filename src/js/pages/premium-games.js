/**
 * MOS-READY — Premium Games (Pay-Gated)
 * Who Wants to Be a Millionaire, Word Survival, Brain Cluster,
 * Recall Rush, Word Tower
 * ₦250 for 5 uses — Learning science: clustering, active recall, spaced repetition
 */
const PremiumGames = {
  COST_PER_5_USES: 250,

  // Check if user has premium game uses remaining
  hasUses() {
    return this.getUsesRemaining() > 0;
  },

  getUsesRemaining() {
    return Storage.get('premiumGameUses', 0);
  },

  useOnePlay() {
    const uses = this.getUsesRemaining();
    if (uses <= 0) return false;
    Storage.set('premiumGameUses', uses - 1);
    return true;
  },

  getTotalPurchased() {
    return Storage.get('premiumGamesPurchased', 0);
  },

  // Payment flow for premium games
  showPaymentModal() {
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
      <div class="modal__header">
        <span class="modal__title">🎮 Premium Games</span>
        <button class="btn btn-ghost btn-icon" onclick="document.getElementById('modal-overlay').classList.remove('active')">✕</button>
      </div>
      <div style="text-align:center">
        <div style="font-size:48px;margin-bottom:var(--space-md)">🎮</div>
        <h3 class="heading-3 mb-sm">Unlock Premium Games</h3>
        <p class="text-secondary mb-lg">5 game plays for ₦250</p>

        <div class="glass-card mb-lg" style="text-align:left">
          <p class="text-sm mb-sm">Includes access to:</p>
          <div style="display:flex;flex-direction:column;gap:6px">
            <span class="text-sm">🏆 Who Wants to Be a Millionaire MOS Word</span>
            <span class="text-sm">🔫 Word Survival (Battle Royale)</span>
            <span class="text-sm">🧠 Brain Cluster Challenge</span>
            <span class="text-sm">⚡ Recall Rush (Spaced Repetition)</span>
            <span class="text-sm">🏗️ Word Tower Builder</span>
          </div>
          <hr style="border:none;border-top:1px solid var(--border-subtle);margin:var(--space-md) 0">
          <div style="display:flex;justify-content:space-between">
            <span class="font-bold">Total</span>
            <span class="font-bold text-gradient">₦250.00</span>
          </div>
        </div>

        <div style="margin-bottom:var(--space-lg)">
          <input type="email" id="pgame-payment-email" placeholder="Your email address"
            style="width:100%">
        </div>

        <button class="btn btn-primary btn-lg w-full" onclick="PremiumGames.processPayment()">
          💳 Pay ₦250 & Get 5 Plays
        </button>
        <p class="text-xs text-tertiary mt-md">Secured by Paystack • Card payment</p>
      </div>
    `;

    modal.classList.add('active');
  },

  async processPayment() {
    const email = document.getElementById('pgame-payment-email')?.value;
    if (!email || !email.includes('@')) {
      Toast.error('Please enter a valid email');
      return;
    }

    try {
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount: 25000, type: 'premium_games' })
      });
      const data = await response.json();

      if (data.success && data.authorization_url) {
        window.open(data.authorization_url, '_blank');
        this._showVerifyUI(data.reference);
      } else {
        this._showDemoPayment();
      }
    } catch {
      this._showDemoPayment();
    }
  },

  _showDemoPayment() {
    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <div style="text-align:center;padding:var(--space-lg)">
        <div style="font-size:48px;margin-bottom:var(--space-md)" class="animate-float">🔄</div>
        <h3 class="heading-3 mb-sm">Demo Mode</h3>
        <p class="text-secondary mb-lg">Payment server not available. Simulate payment for testing.</p>
        <button class="btn btn-primary btn-lg w-full" onclick="PremiumGames.confirmPayment()">
          ✅ Simulate Successful Payment
        </button>
        <button class="btn btn-ghost mt-md" onclick="document.getElementById('modal-overlay').classList.remove('active')">Cancel</button>
      </div>
    `;
  },

  _showVerifyUI(reference) {
    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <div style="text-align:center;padding:var(--space-lg)">
        <div style="font-size:48px;margin-bottom:var(--space-md)" class="animate-float">🔄</div>
        <h3 class="heading-3 mb-sm">Complete Payment</h3>
        <p class="text-secondary mb-lg">Complete payment in the opened window, then verify below.</p>
        <button class="btn btn-primary btn-lg w-full" onclick="PremiumGames.verifyPayment('${reference}')">
          ✅ I've Paid — Verify
        </button>
        <button class="btn btn-ghost mt-md" onclick="document.getElementById('modal-overlay').classList.remove('active')">Cancel</button>
      </div>
    `;
  },

  async verifyPayment(reference) {
    try {
      const res = await fetch(`/api/payment/verify/${reference}`);
      const data = await res.json();
      if (data.success) {
        this.confirmPayment();
      } else {
        Toast.error('Payment not confirmed yet. Try again.');
      }
    } catch {
      Toast.error('Could not verify. Contact support.');
    }
  },

  confirmPayment() {
    const current = this.getUsesRemaining();
    Storage.set('premiumGameUses', current + 5);
    Storage.set('premiumGamesPurchased', this.getTotalPurchased() + 1);
    document.getElementById('modal-overlay').classList.remove('active');
    Toast.success('🎉 5 premium game plays unlocked!');
    Confetti.burst();
    GamesPage.renderGamesList();
  },

  // Try to start a premium game — check uses first
  tryStart(gameName, startFn) {
    if (this.hasUses()) {
      this.useOnePlay();
      Toast.info(`🎮 Premium play used. ${this.getUsesRemaining()} remaining.`);
      startFn();
    } else {
      this.showPaymentModal();
    }
  },

  // =====================================================
  // GAME 1: WHO WANTS TO BE A MILLIONAIRE MOS WORD
  // Learning: Active Recall + Escalating Difficulty
  // =====================================================
  millionaire: {
    currentQ: 0,
    score: 0,
    lifelines: { fiftyFifty: true, askAudience: true, phoneFriend: true },
    questions: [],
    moneyLadder: [
      '₦100', '₦200', '₦500', '₦1,000', '₦2,000',
      '₦5,000', '₦10,000', '₦25,000', '₦50,000', '₦100,000',
      '₦250,000', '₦500,000', '₦1,000,000'
    ],
    safeHavens: [4, 9], // Question indices that are safe havens

    start() {
      const allQs = [...MOCK_EXAM_QUESTIONS, ...Object.values(QUESTION_BANK).flat()];
      // Sort by difficulty (shorter questions = easier, scenario questions = harder)
      const easy = allQs.filter(q => !q.scenario && q.question.length < 80);
      const medium = allQs.filter(q => q.scenario && q.question.length < 120);
      const hard = allQs.filter(q => q.scenario && q.question.length >= 120);

      const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
      this.questions = [
        ...shuffle(easy).slice(0, 5),
        ...shuffle(medium).slice(0, 4),
        ...shuffle(hard).slice(0, 4)
      ];

      this.currentQ = 0;
      this.score = 0;
      this.lifelines = { fiftyFifty: true, askAudience: true, phoneFriend: true };

      this.render();
    },

    render() {
      const area = document.getElementById('game-area');
      if (this.currentQ >= this.questions.length) {
        this.win();
        return;
      }

      const q = this.questions[this.currentQ];
      const moneyLevel = this.moneyLadder[this.currentQ] || '₦1,000,000';
      const isSafe = this.safeHavens.includes(this.currentQ);

      area.innerHTML = `
        <div class="animate-fade-in" style="max-width:800px;margin:0 auto">
          <div class="lesson-breadcrumb" onclick="GamesPage.renderGamesList()" style="cursor:pointer;margin-bottom:var(--space-md)">
            ← Walk Away (Keep ${this.currentQ > 0 ? this.moneyLadder[this.currentQ - 1] : '₦0'})
          </div>

          <div style="display:flex;gap:var(--space-lg);align-items:flex-start">
            <!-- Main Question Area -->
            <div style="flex:1">
              <div style="text-align:center;margin-bottom:var(--space-lg)">
                <div style="font-size:48px;margin-bottom:var(--space-sm)">🏆</div>
                <div class="heading-3 text-gradient" style="font-size:var(--text-2xl)">
                  For ${moneyLevel}
                </div>
                <div class="text-sm text-secondary">Question ${this.currentQ + 1} of ${this.questions.length}</div>
              </div>

              <!-- Lifelines -->
              <div style="display:flex;gap:var(--space-sm);justify-content:center;margin-bottom:var(--space-lg)">
                <button class="btn ${this.lifelines.fiftyFifty ? 'btn-secondary' : 'btn-ghost'}" style="opacity:${this.lifelines.fiftyFifty ? 1 : 0.3}"
                  onclick="PremiumGames.millionaire.useFiftyFifty()" ${!this.lifelines.fiftyFifty ? 'disabled' : ''}>
                  50:50
                </button>
                <button class="btn ${this.lifelines.askAudience ? 'btn-secondary' : 'btn-ghost'}" style="opacity:${this.lifelines.askAudience ? 1 : 0.3}"
                  onclick="PremiumGames.millionaire.useAskAudience()" ${!this.lifelines.askAudience ? 'disabled' : ''}>
                  👥 Audience
                </button>
                <button class="btn ${this.lifelines.phoneFriend ? 'btn-secondary' : 'btn-ghost'}" style="opacity:${this.lifelines.phoneFriend ? 1 : 0.3}"
                  onclick="PremiumGames.millionaire.usePhoneFriend()" ${!this.lifelines.phoneFriend ? 'disabled' : ''}>
                  📞 Friend
                </button>
              </div>

              <div class="quiz-question-card" style="background:linear-gradient(135deg, rgba(124,92,252,0.1), rgba(0,0,0,0))">
                ${q.scenario ? `<div class="quiz-question__scenario">📋 ${q.scenario}</div>` : ''}
                <div class="quiz-question__text">${q.question}</div>
                <div class="quiz-options" id="mill-options">
                  ${q.options.map((opt, i) => `
                    <div class="quiz-option mill-opt" data-idx="${i}" onclick="PremiumGames.millionaire.answer(${i})">
                      <span class="quiz-option__letter">${String.fromCharCode(65 + i)}</span>
                      <span>${opt}</span>
                    </div>
                  `).join('')}
                </div>
                <div id="mill-feedback"></div>
              </div>
            </div>

            <!-- Money Ladder -->
            <div style="width:160px;flex-shrink:0">
              <div class="glass-card" style="padding:var(--space-sm)">
                <div style="display:flex;flex-direction:column-reverse;gap:2px">
                  ${this.moneyLadder.map((m, i) => {
                    const isCurrent = i === this.currentQ;
                    const isPast = i < this.currentQ;
                    const isSafeLevel = this.safeHavens.includes(i);
                    return `<div style="padding:4px 8px;font-size:0.7rem;border-radius:4px;font-weight:${isCurrent ? '700' : '400'};
                      background:${isCurrent ? 'var(--gradient-primary)' : isPast ? 'rgba(0,245,212,0.1)' : 'transparent'};
                      color:${isCurrent ? 'white' : isPast ? 'var(--accent-cyan)' : isSafeLevel ? 'var(--accent-yellow)' : 'var(--text-tertiary)'};
                      ${isSafeLevel ? 'border-left:2px solid var(--accent-yellow)' : ''}">
                      ${i + 1}. ${m}
                    </div>`;
                  }).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    answer(idx) {
      const q = this.questions[this.currentQ];
      const correct = idx === q.correct;

      document.querySelectorAll('.mill-opt').forEach((el, i) => {
        if (i === q.correct) el.classList.add('correct');
        if (i === idx && !correct) el.classList.add('incorrect');
        el.style.pointerEvents = 'none';
      });

      const fb = document.getElementById('mill-feedback');
      if (correct) {
        fb.innerHTML = `<div class="quiz-feedback quiz-feedback--correct">✅ Correct! ${q.explanation}</div>`;
        this.currentQ++;
        setTimeout(() => this.render(), 1500);
      } else {
        // Game over — fall to last safe haven
        const safeLevel = [...this.safeHavens].reverse().find(s => s < this.currentQ);
        const prize = safeLevel !== undefined ? this.moneyLadder[safeLevel] : '₦0';
        fb.innerHTML = `<div class="quiz-feedback quiz-feedback--incorrect">❌ Wrong! The answer was: ${q.options[q.correct]}. You won ${prize}.</div>`;
        setTimeout(() => this.gameOver(prize), 2000);
      }
    },

    useFiftyFifty() {
      if (!this.lifelines.fiftyFifty) return;
      this.lifelines.fiftyFifty = false;
      const q = this.questions[this.currentQ];
      const wrongIndices = q.options.map((_, i) => i).filter(i => i !== q.correct);
      const toRemove = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
      toRemove.forEach(i => {
        const el = document.querySelector(`.mill-opt[data-idx="${i}"]`);
        if (el) { el.style.opacity = '0.2'; el.style.pointerEvents = 'none'; }
      });
      this.render = this.render; // Keep state
    },

    useAskAudience() {
      if (!this.lifelines.askAudience) return;
      this.lifelines.askAudience = false;
      const q = this.questions[this.currentQ];
      const fb = document.getElementById('mill-feedback');
      // Simulate audience — correct answer gets highest %
      const percents = q.options.map((_, i) => i === q.correct ? 40 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 20));
      const total = percents.reduce((a, b) => a + b, 0);
      const normalized = percents.map(p => Math.round((p / total) * 100));
      fb.innerHTML = `<div class="hint-text">👥 Audience Poll: ${normalized.map((p, i) => `${String.fromCharCode(65 + i)}: ${p}%`).join(' | ')}</div>`;
    },

    usePhoneFriend() {
      if (!this.lifelines.phoneFriend) return;
      this.lifelines.phoneFriend = false;
      const q = this.questions[this.currentQ];
      const fb = document.getElementById('mill-feedback');
      const confidence = 60 + Math.floor(Math.random() * 35);
      fb.innerHTML = `<div class="hint-text">📞 "I'm ${confidence}% sure it's ${String.fromCharCode(65 + q.correct)}: ${q.options[q.correct]}"</div>`;
    },

    win() {
      XP.award(100, 'Won Who Wants to Be a Millionaire!');
      Storage.addActivity({ type: 'game', text: 'Won Who Wants to Be a Millionaire MOS Word!' });
      Confetti.burst();
      GamesPage._showGameWon('Who Wants to Be a Millionaire', 100, 'You won ₦1,000,000! (Virtual)');
    },

    gameOver(prize) {
      const xp = this.currentQ * 5;
      XP.award(xp, `Millionaire: Reached Q${this.currentQ + 1}`);
      Storage.addActivity({ type: 'game', text: `Millionaire: Won ${prize}` });
      GamesPage._showGameWon('Who Wants to Be a Millionaire', xp, `You won ${prize}! Made it to Question ${this.currentQ + 1}`);
    }
  },

  // =====================================================
  // GAME 2: WORD SURVIVAL (Battle Royale / FreeFire Style)
  // Learning: Elimination-based active recall under pressure
  // =====================================================
  survival: {
    lives: 5,
    round: 0,
    score: 0,
    questions: [],
    maxRounds: 15,
    shields: 1,

    start() {
      const allQs = [...Object.values(QUESTION_BANK).flat(), ...MOCK_EXAM_QUESTIONS];
      this.questions = [...allQs].sort(() => Math.random() - 0.5).slice(0, this.maxRounds);
      this.lives = 5;
      this.round = 0;
      this.score = 0;
      this.shields = 1;
      this.render();
    },

    render() {
      const area = document.getElementById('game-area');
      if (this.round >= this.questions.length || this.lives <= 0) {
        this.endGame();
        return;
      }

      const q = this.questions[this.round];
      const healthBar = '❤️'.repeat(this.lives) + '🖤'.repeat(5 - this.lives);

      area.innerHTML = `
        <div class="animate-fade-in" style="max-width:720px;margin:0 auto">
          <div class="lesson-breadcrumb" onclick="GamesPage.renderGamesList()" style="cursor:pointer;margin-bottom:var(--space-md)">← Retreat</div>

          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-lg)">
            <div>
              <div class="heading-3" style="color:var(--accent-pink)">🔫 Word Survival</div>
              <div class="text-sm text-secondary">Round ${this.round + 1}/${this.maxRounds}</div>
            </div>
            <div style="display:flex;gap:var(--space-md);align-items:center">
              ${this.shields > 0 ? `<button class="btn btn-sm btn-secondary" onclick="PremiumGames.survival.useShield()">🛡️ Shield (${this.shields})</button>` : ''}
              <div style="font-size:1.2rem;letter-spacing:2px">${healthBar}</div>
              <span class="badge badge-success">Score: ${this.score}</span>
            </div>
          </div>

          <div class="quiz-question-card" style="border:2px solid ${this.lives <= 2 ? 'var(--accent-pink)' : 'var(--border-subtle)'};${this.lives <= 2 ? 'animation:pulse-glow 1s infinite' : ''}">
            ${q.scenario ? `<div class="quiz-question__scenario">🎯 ${q.scenario}</div>` : ''}
            <div class="quiz-question__text">${q.question}</div>
            <div class="text-xs text-tertiary mb-md">⚠️ Wrong answer = lose a life!</div>
            <div class="quiz-options" id="surv-options">
              ${q.options.map((opt, i) => `
                <div class="quiz-option" onclick="PremiumGames.survival.answer(${i})">
                  <span class="quiz-option__letter">${String.fromCharCode(65 + i)}</span>
                  <span>${opt}</span>
                </div>
              `).join('')}
            </div>
            <div id="surv-feedback"></div>
          </div>
        </div>
      `;
    },

    answer(idx) {
      const q = this.questions[this.round];
      const correct = idx === q.correct;

      document.querySelectorAll('#surv-options .quiz-option').forEach((el, i) => {
        if (i === q.correct) el.classList.add('correct');
        if (i === idx && !correct) el.classList.add('incorrect');
        el.style.pointerEvents = 'none';
      });

      if (correct) {
        this.score++;
        document.getElementById('surv-feedback').innerHTML = `<div class="quiz-feedback quiz-feedback--correct">✅ Target eliminated! +1 point</div>`;
      } else {
        this.lives--;
        document.getElementById('surv-feedback').innerHTML = `<div class="quiz-feedback quiz-feedback--incorrect">💥 Hit! You lost a life! Answer: ${q.options[q.correct]}</div>`;
      }

      this.round++;
      setTimeout(() => this.render(), 1500);
    },

    useShield() {
      if (this.shields > 0) {
        this.shields--;
        this.lives = Math.min(5, this.lives + 1);
        Toast.success('🛡️ Shield activated! +1 life restored');
        this.render();
      }
    },

    endGame() {
      const xp = this.score * 8 + (this.lives > 0 ? 20 : 0);
      const survived = this.lives > 0;
      XP.award(xp, `Word Survival: ${this.score} kills`);
      Storage.addActivity({ type: 'game', text: `Word Survival: ${survived ? 'Survived!' : 'Eliminated'} — ${this.score} correct` });
      if (survived) Confetti.burst();
      GamesPage._showGameWon('Word Survival', xp, survived
        ? `🎉 You survived all ${this.maxRounds} rounds! ${this.score} correct, ${this.lives} lives remaining`
        : `💀 Eliminated at Round ${this.round}. ${this.score} correct answers.`);
    }
  },

  // =====================================================
  // GAME 3: BRAIN CLUSTER CHALLENGE
  // Learning: Clustering technique — group related concepts
  // =====================================================
  cluster: {
    clusters: [],
    items: [],
    selectedItems: [],
    solvedClusters: [],
    attempts: 0,
    maxAttempts: 4,

    start() {
      // Create 4 clusters of 4 related MOS Word concepts
      const clusterData = [
        { category: 'Text Formatting', color: '#7c5cfc', items: ['Bold (Ctrl+B)', 'Font Size', 'Text Effects', 'Format Painter'] },
        { category: 'Page Layout', color: '#f72585', items: ['Margins', 'Orientation', 'Section Breaks', 'Columns'] },
        { category: 'References', color: '#00f5d4', items: ['Table of Contents', 'Footnotes', 'Citations', 'Cross-References'] },
        { category: 'Collaboration', color: '#fee440', items: ['Track Changes', 'Comments', 'Compare Docs', 'Mail Merge'] },
        { category: 'Tables', color: '#ff6b35', items: ['Merge Cells', 'Sort Data', 'Table Styles', 'Formulas (SUM)'] },
        { category: 'Graphics', color: '#a8e10c', items: ['SmartArt', 'Text Wrapping', 'Screenshots', 'Shapes'] },
        { category: 'Document Management', color: '#3a86ff', items: ['Save As PDF', 'Navigation Pane', 'Properties', 'Templates'] },
        { category: 'Accessibility', color: '#e040fb', items: ['Alt Text', 'Heading Structure', 'Reading Order', 'Accessibility Checker'] }
      ];

      // Pick 4 random clusters
      const selected = [...clusterData].sort(() => Math.random() - 0.5).slice(0, 4);
      this.clusters = selected;
      this.items = selected.flatMap(c => c.items).sort(() => Math.random() - 0.5);
      this.selectedItems = [];
      this.solvedClusters = [];
      this.attempts = 0;
      this.maxAttempts = 4;

      this.render();
    },

    render() {
      const area = document.getElementById('game-area');

      area.innerHTML = `
        <div class="animate-fade-in" style="max-width:700px;margin:0 auto">
          <div class="lesson-breadcrumb" onclick="GamesPage.renderGamesList()" style="cursor:pointer;margin-bottom:var(--space-md)">← Back</div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-lg)">
            <div>
              <h3 class="heading-3">🧠 Brain Cluster</h3>
              <p class="text-sm text-secondary">Group 4 related MOS Word concepts together</p>
            </div>
            <div style="display:flex;gap:var(--space-sm)">
              <span class="badge badge-danger">Mistakes left: ${this.maxAttempts - this.attempts}</span>
              <span class="badge badge-success">Solved: ${this.solvedClusters.length}/4</span>
            </div>
          </div>

          <!-- Solved clusters -->
          ${this.solvedClusters.map(c => `
            <div class="glass-card mb-sm" style="border-left:3px solid ${c.color};padding:var(--space-sm) var(--space-md)">
              <span class="font-bold text-sm" style="color:${c.color}">${c.category}</span>
              <span class="text-sm text-secondary"> — ${c.items.join(', ')}</span>
            </div>
          `).join('')}

          <!-- Remaining items grid -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-sm);margin:var(--space-lg) 0">
            ${this.items.filter(item => !this.solvedClusters.some(c => c.items.includes(item))).map(item => {
              const isSelected = this.selectedItems.includes(item);
              return `
                <button class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.75rem;padding:12px 8px;white-space:normal;line-height:1.3"
                  onclick="PremiumGames.cluster.toggleItem('${item.replace(/'/g, "\\'")}')">
                  ${item}
                </button>
              `;
            }).join('')}
          </div>

          <div style="display:flex;justify-content:center;gap:var(--space-md)">
            <button class="btn btn-primary btn-lg" onclick="PremiumGames.cluster.submitGroup()" ${this.selectedItems.length !== 4 ? 'disabled style="opacity:0.5"' : ''}>
              Submit Group (${this.selectedItems.length}/4)
            </button>
            <button class="btn btn-ghost" onclick="PremiumGames.cluster.selectedItems=[];PremiumGames.cluster.render()">Clear</button>
          </div>
          <div id="cluster-feedback" style="margin-top:var(--space-md)"></div>
        </div>
      `;
    },

    toggleItem(item) {
      const idx = this.selectedItems.indexOf(item);
      if (idx >= 0) {
        this.selectedItems.splice(idx, 1);
      } else if (this.selectedItems.length < 4) {
        this.selectedItems.push(item);
      }
      this.render();
    },

    submitGroup() {
      if (this.selectedItems.length !== 4) return;

      // Check if all 4 items belong to the same cluster
      const match = this.clusters.find(c =>
        !this.solvedClusters.includes(c) &&
        this.selectedItems.every(item => c.items.includes(item))
      );

      if (match) {
        this.solvedClusters.push(match);
        this.selectedItems = [];
        Toast.success(`✅ Found cluster: ${match.category}!`);

        if (this.solvedClusters.length === 4) {
          // Won!
          XP.award(40, 'Won Brain Cluster Challenge');
          Storage.addActivity({ type: 'game', text: `Won Brain Cluster in ${this.attempts} mistakes` });
          Confetti.burst();
          setTimeout(() => GamesPage._showGameWon('Brain Cluster', 40, `Solved all 4 clusters with ${this.attempts} mistakes!`), 500);
        } else {
          this.render();
        }
      } else {
        this.attempts++;
        this.selectedItems = [];
        if (this.attempts >= this.maxAttempts) {
          Toast.error('💀 Too many mistakes! Game over.');
          XP.award(this.solvedClusters.length * 10, 'Brain Cluster attempt');
          setTimeout(() => GamesPage._showGameWon('Brain Cluster', this.solvedClusters.length * 10, `Solved ${this.solvedClusters.length}/4 clusters`), 500);
        } else {
          Toast.error(`❌ Not a cluster! ${this.maxAttempts - this.attempts} mistakes left.`);
          this.render();
        }
      }
    }
  },

  // =====================================================
  // GAME 4: RECALL RUSH (Spaced Repetition Flashcards)
  // Learning: Active recall + spaced repetition scheduling
  // =====================================================
  recall: {
    cards: [],
    currentIdx: 0,
    correct: 0,
    wrong: 0,
    showingAnswer: false,
    totalCards: 15,

    start() {
      // Build flashcards from learning modules
      const cards = [];
      LEARNING_MODULES.forEach(mod => {
        mod.steps.forEach(step => {
          cards.push({
            question: step.title,
            answer: step.content.replace(/<[^>]*>/g, ''), // Strip HTML
            tip: step.tip || '',
            module: mod.title,
            difficulty: 'new' // new, learning, mastered
          });
        });
      });

      this.cards = [...cards].sort(() => Math.random() - 0.5).slice(0, this.totalCards);
      this.currentIdx = 0;
      this.correct = 0;
      this.wrong = 0;
      this.showingAnswer = false;
      this.render();
    },

    render() {
      const area = document.getElementById('game-area');
      if (this.currentIdx >= this.cards.length) {
        this.endGame();
        return;
      }

      const card = this.cards[this.currentIdx];
      const progress = (this.currentIdx / this.cards.length) * 100;

      area.innerHTML = `
        <div class="animate-fade-in" style="max-width:600px;margin:0 auto">
          <div class="lesson-breadcrumb" onclick="GamesPage.renderGamesList()" style="cursor:pointer;margin-bottom:var(--space-md)">← Back</div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-lg)">
            <h3 class="heading-3">⚡ Recall Rush</h3>
            <div style="display:flex;gap:var(--space-sm)">
              <span class="badge badge-success">✅ ${this.correct}</span>
              <span class="badge badge-danger">❌ ${this.wrong}</span>
              <span class="badge badge-primary">${this.currentIdx + 1}/${this.cards.length}</span>
            </div>
          </div>

          <div class="progress-bar mb-lg"><div class="progress-bar__fill" style="width:${progress}%"></div></div>

          <div class="quiz-question-card" style="min-height:250px;cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center"
               onclick="PremiumGames.recall.flip()">
            <div class="text-xs text-tertiary mb-sm">${card.module}</div>
            ${!this.showingAnswer ? `
              <div style="font-size:24px;margin-bottom:var(--space-md)">🧠</div>
              <div class="heading-4 mb-md">${card.question}</div>
              <div class="text-sm text-secondary">What do you know about this? (Click to reveal)</div>
            ` : `
              <div style="font-size:24px;margin-bottom:var(--space-md)">💡</div>
              <div class="text-sm mb-md" style="line-height:1.7;text-align:left;max-width:500px">${card.answer}</div>
              ${card.tip ? `<div class="lesson-step__tip" style="text-align:left;width:100%">💡 ${card.tip}</div>` : ''}
            `}
          </div>

          ${this.showingAnswer ? `
            <div style="display:flex;gap:var(--space-md);margin-top:var(--space-lg);justify-content:center">
              <button class="btn btn-lg" style="background:rgba(247,37,133,0.15);border:2px solid var(--accent-pink);color:var(--accent-pink);flex:1"
                onclick="PremiumGames.recall.rate('wrong')">
                😰 Didn't Know
              </button>
              <button class="btn btn-lg" style="background:rgba(254,228,64,0.15);border:2px solid var(--accent-yellow);color:var(--accent-yellow);flex:1"
                onclick="PremiumGames.recall.rate('partial')">
                🤔 Partially Knew
              </button>
              <button class="btn btn-lg" style="background:rgba(0,245,212,0.15);border:2px solid var(--accent-cyan);color:var(--accent-cyan);flex:1"
                onclick="PremiumGames.recall.rate('correct')">
                😎 Knew It!
              </button>
            </div>
          ` : ''}
        </div>
      `;
    },

    flip() {
      this.showingAnswer = !this.showingAnswer;
      this.render();
    },

    rate(rating) {
      if (rating === 'correct') this.correct++;
      else if (rating === 'wrong') this.wrong++;
      else this.correct += 0.5;
      this.currentIdx++;
      this.showingAnswer = false;
      this.render();
    },

    endGame() {
      const accuracy = Math.round((this.correct / this.cards.length) * 100);
      const xp = Math.round(this.correct * 5) + (accuracy >= 80 ? 20 : 0);
      XP.award(xp, `Recall Rush: ${accuracy}% recall`);
      Storage.addActivity({ type: 'game', text: `Recall Rush: ${accuracy}% recall rate` });
      if (accuracy >= 80) Confetti.burst();
      GamesPage._showGameWon('Recall Rush', xp, `${accuracy}% recall rate • ${Math.round(this.correct)} concepts mastered`);
    }
  },

  // =====================================================
  // GAME 5: WORD TOWER (3D Tower Building)
  // Learning: Progressive difficulty — answer to build floors
  // =====================================================
  tower: {
    floors: 0,
    maxFloors: 12,
    questions: [],
    currentQ: 0,
    wobble: 0,

    start() {
      const allQs = [...Object.values(QUESTION_BANK).flat()];
      this.questions = [...allQs].sort(() => Math.random() - 0.5).slice(0, this.maxFloors);
      this.floors = 0;
      this.currentQ = 0;
      this.wobble = 0;
      this.render();
    },

    render() {
      const area = document.getElementById('game-area');
      if (this.currentQ >= this.questions.length) {
        this.win();
        return;
      }

      const q = this.questions[this.currentQ];
      const towerColors = ['#7c5cfc', '#f72585', '#00f5d4', '#fee440', '#ff6b35', '#a8e10c', '#3a86ff', '#e040fb', '#7c5cfc', '#f72585', '#00f5d4', '#fee440'];

      area.innerHTML = `
        <div class="animate-fade-in" style="max-width:800px;margin:0 auto;display:flex;gap:var(--space-xl);align-items:flex-end">
          <!-- Tower Visualization -->
          <div style="width:200px;flex-shrink:0">
            <div class="text-center mb-sm">
              <span class="heading-4">🏗️ ${this.floors}F</span>
            </div>
            <div style="display:flex;flex-direction:column-reverse;align-items:center;min-height:400px;justify-content:flex-start;gap:2px;perspective:400px">
              ${Array.from({ length: this.floors }).map((_, i) => `
                <div style="width:${160 - i * 4}px;height:30px;background:${towerColors[i % towerColors.length]};border-radius:4px;
                  display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:rgba(0,0,0,0.6);
                  transform:perspective(400px) rotateX(5deg) rotateY(${Math.sin(i * 0.5) * (this.wobble * 2)}deg);
                  box-shadow:0 2px 4px rgba(0,0,0,0.3);transition:all 0.3s">
                  Floor ${i + 1}
                </div>
              `).join('')}
              <div style="width:180px;height:12px;background:var(--text-tertiary);border-radius:4px;margin-top:4px">
              </div>
            </div>
          </div>

          <!-- Question -->
          <div style="flex:1">
            <div class="lesson-breadcrumb" onclick="GamesPage.renderGamesList()" style="cursor:pointer;margin-bottom:var(--space-md)">← Quit Building</div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
              <h3 class="heading-3">🏗️ Word Tower</h3>
              <span class="text-sm text-secondary">Floor ${this.floors + 1} of ${this.maxFloors}</span>
            </div>
            <div class="quiz-question-card">
              <div class="text-sm text-secondary mb-sm">Answer correctly to add a floor! Wrong answer = tower wobbles!</div>
              <div class="quiz-question__text">${q.question}</div>
              <div class="quiz-options" id="tower-options">
                ${q.options.map((opt, i) => `
                  <div class="quiz-option" onclick="PremiumGames.tower.answer(${i})">
                    <span class="quiz-option__letter">${String.fromCharCode(65 + i)}</span>
                    <span>${opt}</span>
                  </div>
                `).join('')}
              </div>
              <div id="tower-feedback"></div>
            </div>
          </div>
        </div>
      `;
    },

    answer(idx) {
      const q = this.questions[this.currentQ];
      const correct = idx === q.correct;

      document.querySelectorAll('#tower-options .quiz-option').forEach((el, i) => {
        if (i === q.correct) el.classList.add('correct');
        if (i === idx && !correct) el.classList.add('incorrect');
        el.style.pointerEvents = 'none';
      });

      if (correct) {
        this.floors++;
        document.getElementById('tower-feedback').innerHTML = `<div class="quiz-feedback quiz-feedback--correct">✅ Floor added! Tower grows!</div>`;
      } else {
        this.wobble++;
        document.getElementById('tower-feedback').innerHTML = `<div class="quiz-feedback quiz-feedback--incorrect">🏚️ Tower wobbles! Answer: ${q.options[q.correct]}</div>`;
        if (this.wobble >= 3) {
          // Tower collapses!
          setTimeout(() => {
            Toast.error('💥 Tower collapsed!');
            this.endGame(false);
          }, 1500);
          return;
        }
      }

      this.currentQ++;
      setTimeout(() => this.render(), 1200);
    },

    win() {
      XP.award(60, 'Built complete Word Tower!');
      Storage.addActivity({ type: 'game', text: `Built ${this.floors}-floor Word Tower!` });
      Confetti.burst();
      GamesPage._showGameWon('Word Tower', 60, `🏗️ Built a ${this.floors}-floor tower with only ${this.wobble} wobble${this.wobble !== 1 ? 's' : ''}!`);
    },

    endGame(won = false) {
      const xp = this.floors * 5;
      XP.award(xp, `Word Tower: ${this.floors} floors`);
      Storage.addActivity({ type: 'game', text: `Word Tower: ${this.floors} floors before ${won ? 'completion' : 'collapse'}` });
      GamesPage._showGameWon('Word Tower', xp, won
        ? `🏗️ ${this.floors}-floor tower complete!`
        : `💥 Tower collapsed after ${this.floors} floors! Too many wrong answers.`);
    }
  }
};

window.PremiumGames = PremiumGames;
