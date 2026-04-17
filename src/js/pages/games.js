/**
 * MOS-READY — Games Page (Match, Speed Quiz, Ordering)
 */
const GamesPage = {
  init() {
    this.renderGamesList();
    Router.onPageEnter('games', () => this.renderGamesList());
  },

  renderGamesList() {
    const list = document.getElementById('games-list');
    const gameArea = document.getElementById('game-area');
    const header = document.querySelector('#page-games .page__header');

    if (!list) return;
    list.style.display = '';
    gameArea.style.display = 'none';
    header.style.display = '';

    list.innerHTML = `
      <div class="game-card" onclick="GamesPage.startMatchGame()">
        <div class="game-card__banner" style="background:var(--gradient-primary)">🃏</div>
        <div class="game-card__body">
          <div class="game-card__title">Match Master</div>
          <div class="game-card__desc">Match MOS Word questions to their correct answers. Flip cards and find pairs!</div>
          <div class="game-card__xp">⚡ +30 XP per win</div>
        </div>
      </div>

      <div class="game-card" onclick="GamesPage.startSpeedQuiz()">
        <div class="game-card__banner" style="background:var(--gradient-warm)">⚡</div>
        <div class="game-card__body">
          <div class="game-card__title">Speed Blitz</div>
          <div class="game-card__desc">Answer as many questions correctly in 60 seconds. Race against the clock!</div>
          <div class="game-card__xp">⚡ +5 XP per correct answer</div>
        </div>
      </div>

      <div class="game-card" onclick="GamesPage.startDragOrder()">
        <div class="game-card__banner" style="background:var(--gradient-accent)">📋</div>
        <div class="game-card__body">
          <div class="game-card__title">Step Sorter</div>
          <div class="game-card__desc">Put Word procedures in the correct order. Test your step-by-step knowledge!</div>
          <div class="game-card__xp">⚡ +25 XP per win</div>
        </div>
      </div>
    `;
  },

  // ===== MATCH GAME =====
  matchPairs: [],
  matchFlipped: [],
  matchMatched: [],
  matchMoves: 0,

  startMatchGame() {
    const list = document.getElementById('games-list');
    const gameArea = document.getElementById('game-area');
    const header = document.querySelector('#page-games .page__header');

    list.style.display = 'none';
    header.style.display = 'none';
    gameArea.style.display = 'block';

    // Pick 6 random questions for 12 cards (6 pairs)
    const allQs = Object.values(QUESTION_BANK).flat();
    const shuffled = [...allQs].sort(() => Math.random() - 0.5).slice(0, 6);

    // Create pairs: short question → correct answer
    const cards = [];
    shuffled.forEach((q, i) => {
      const shortQ = q.question.length > 60 ? q.question.substring(0, 57) + '...' : q.question;
      const answer = q.options[q.correct];
      const shortA = answer.length > 50 ? answer.substring(0, 47) + '...' : answer;
      cards.push({ id: i, type: 'question', pairId: i, text: shortQ });
      cards.push({ id: i + 100, type: 'answer', pairId: i, text: shortA });
    });

    this.matchPairs = cards.sort(() => Math.random() - 0.5);
    this.matchFlipped = [];
    this.matchMatched = [];
    this.matchMoves = 0;

    this._renderMatchBoard();
  },

  _renderMatchBoard() {
    const gameArea = document.getElementById('game-area');
    const matchedCount = this.matchMatched.length / 2;

    gameArea.innerHTML = `
      <div class="animate-fade-in" style="max-width:800px;margin:0 auto">
        <div class="lesson-breadcrumb" onclick="GamesPage.renderGamesList()" style="cursor:pointer;margin-bottom:var(--space-lg)">
          ← Back to Games
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-lg)">
          <h3 class="heading-3">🃏 Match Master</h3>
          <div style="display:flex;gap:var(--space-md)">
            <span class="badge badge-primary">Moves: ${this.matchMoves}</span>
            <span class="badge badge-success">Matched: ${matchedCount}/6</span>
          </div>
        </div>
        <div class="match-game-board" id="match-board">
          ${this.matchPairs.map((card, i) => {
            const isFlipped = this.matchFlipped.includes(i) || this.matchMatched.includes(i);
            const isMatched = this.matchMatched.includes(i);
            return `
              <div class="match-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}"
                   onclick="GamesPage.flipCard(${i})" data-index="${i}">
                <div class="match-card__front">❓</div>
                <div class="match-card__back" style="font-size:${card.text.length > 40 ? '0.7rem' : '0.8rem'}">
                  <span style="color:${card.type === 'question' ? 'var(--primary-300)' : 'var(--accent-cyan)'}">
                    ${card.type === 'question' ? '❓ ' : '✅ '}
                  </span>
                  ${card.text}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  flipCard(index) {
    if (this.matchFlipped.length >= 2) return;
    if (this.matchFlipped.includes(index)) return;
    if (this.matchMatched.includes(index)) return;

    this.matchFlipped.push(index);

    // Animate flip
    const cardEl = document.querySelector(`.match-card[data-index="${index}"]`);
    if (cardEl) cardEl.classList.add('flipped');

    if (this.matchFlipped.length === 2) {
      this.matchMoves++;
      const [i1, i2] = this.matchFlipped;
      const card1 = this.matchPairs[i1];
      const card2 = this.matchPairs[i2];

      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // Match!
        setTimeout(() => {
          this.matchMatched.push(i1, i2);
          this.matchFlipped = [];
          this._renderMatchBoard();

          if (this.matchMatched.length === this.matchPairs.length) {
            // Game won!
            XP.award(30, 'Won Match Master');
            Storage.addActivity({ type: 'game', text: `Won Match Master in ${this.matchMoves} moves` });
            Storage.setGameScore('match', { moves: this.matchMoves });
            Confetti.burst();

            setTimeout(() => {
              this._showGameWon('Match Master', 30, `Completed in ${this.matchMoves} moves`);
            }, 500);
          }
        }, 300);
      } else {
        // No match — flip back
        setTimeout(() => {
          this.matchFlipped = [];
          this._renderMatchBoard();
        }, 1000);
      }
    }
  },

  // ===== SPEED QUIZ =====
  speedTimer: null,
  speedTimeLeft: 60,
  speedScore: 0,
  speedQuestions: [],
  speedCurrent: 0,

  startSpeedQuiz() {
    document.getElementById('games-list').style.display = 'none';
    document.querySelector('#page-games .page__header').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';

    const allQs = Object.values(QUESTION_BANK).flat();
    this.speedQuestions = [...allQs].sort(() => Math.random() - 0.5);
    this.speedCurrent = 0;
    this.speedScore = 0;
    this.speedTimeLeft = 60;

    if (this.speedTimer) clearInterval(this.speedTimer);
    this.speedTimer = setInterval(() => {
      this.speedTimeLeft--;
      const timerEl = document.getElementById('speed-timer');
      if (timerEl) {
        timerEl.textContent = this.speedTimeLeft + 's';
        if (this.speedTimeLeft <= 10) timerEl.style.color = 'var(--accent-pink)';
      }
      if (this.speedTimeLeft <= 0) {
        clearInterval(this.speedTimer);
        this._endSpeedQuiz();
      }
    }, 1000);

    this._renderSpeedQuestion();
  },

  _renderSpeedQuestion() {
    const area = document.getElementById('game-area');
    const q = this.speedQuestions[this.speedCurrent % this.speedQuestions.length];

    area.innerHTML = `
      <div class="animate-fade-in" style="max-width:720px;margin:0 auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-xl)">
          <h3 class="heading-3">⚡ Speed Blitz</h3>
          <div style="display:flex;gap:var(--space-md)">
            <span class="badge badge-warning" id="speed-timer" style="font-size:var(--text-lg);padding:8px 16px">
              ${this.speedTimeLeft}s
            </span>
            <span class="badge badge-success" style="font-size:var(--text-lg);padding:8px 16px">
              Score: ${this.speedScore}
            </span>
          </div>
        </div>

        <div class="quiz-question-card">
          <div class="quiz-question__text" style="font-size:var(--text-lg);">${q.question}</div>
          <div class="quiz-options">
            ${q.options.map((opt, i) => `
              <div class="quiz-option" onclick="GamesPage.speedAnswer(${i}, ${q.correct})">
                <span class="quiz-option__letter">${String.fromCharCode(65 + i)}</span>
                <span>${opt}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  speedAnswer(selected, correct) {
    if (selected === correct) {
      this.speedScore++;
    }
    this.speedCurrent++;
    this._renderSpeedQuestion();
  },

  _endSpeedQuiz() {
    const xpEarned = this.speedScore * 5;
    XP.award(xpEarned, `Speed Blitz: ${this.speedScore} correct`);
    Storage.addActivity({ type: 'game', text: `Speed Blitz: ${this.speedScore} correct in 60s` });
    Storage.setGameScore('speed', { score: this.speedScore });

    if (this.speedScore >= 10) Confetti.burst();

    this._showGameWon('Speed Blitz', xpEarned, `${this.speedScore} correct answers in 60 seconds`);
  },

  // ===== STEP SORTER (Drag-and-Drop Style - Click-Based) =====
  orderSteps: [],
  orderCorrect: [],
  orderCurrent: [],

  startDragOrder() {
    document.getElementById('games-list').style.display = 'none';
    document.querySelector('#page-games .page__header').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';

    // Pick a random module and its steps
    const mod = LEARNING_MODULES[Math.floor(Math.random() * LEARNING_MODULES.length)];
    this.orderCorrect = mod.steps.map((s, i) => ({ index: i, title: s.title }));
    this.orderCurrent = [...this.orderCorrect].sort(() => Math.random() - 0.5);
    this.orderModule = mod;

    this._renderOrderGame();
  },

  _renderOrderGame() {
    const area = document.getElementById('game-area');
    const isCorrect = this.orderCurrent.every((s, i) => s.index === i);

    area.innerHTML = `
      <div class="animate-fade-in" style="max-width:600px;margin:0 auto">
        <div class="lesson-breadcrumb" onclick="GamesPage.renderGamesList()" style="cursor:pointer;margin-bottom:var(--space-lg)">
          ← Back to Games
        </div>
        <h3 class="heading-3 mb-sm">📋 Step Sorter</h3>
        <p class="text-secondary mb-lg">Arrange the steps for "${this.orderModule.title}" in the correct order. Click two items to swap them.</p>

        <div style="display:flex;flex-direction:column;gap:var(--space-sm)" id="order-list">
          ${this.orderCurrent.map((step, i) => `
            <div class="quiz-option ${this._orderSelected === i ? 'selected' : ''}"
                 onclick="GamesPage.selectOrderItem(${i})"
                 style="cursor:pointer;${step.index === i ? 'border-color:var(--accent-cyan)' : ''}">
              <span class="quiz-option__letter">${i + 1}</span>
              <span>${step.title}</span>
              ${step.index === i ? '<span style="margin-left:auto;color:var(--accent-cyan)">✓</span>' : ''}
            </div>
          `).join('')}
        </div>

        ${isCorrect ? `
          <div class="text-center mt-xl animate-scale-in">
            <div style="font-size:64px;margin-bottom:var(--space-md)">🎉</div>
            <h3 class="heading-3 mb-sm">Perfect Order!</h3>
            <p class="text-secondary mb-lg">You know your steps!</p>
            <button class="btn btn-primary" onclick="GamesPage.startDragOrder()">Play Again 🔄</button>
          </div>
        ` : ''}
      </div>
    `;

    if (isCorrect && !this._orderWon) {
      this._orderWon = true;
      XP.award(25, 'Won Step Sorter');
      Storage.addActivity({ type: 'game', text: `Won Step Sorter: ${this.orderModule.title}` });
      Confetti.burst();
    }
  },

  _orderSelected: -1,

  selectOrderItem(index) {
    if (this._orderSelected === -1) {
      this._orderSelected = index;
      this._renderOrderGame();
    } else {
      // Swap
      const temp = this.orderCurrent[this._orderSelected];
      this.orderCurrent[this._orderSelected] = this.orderCurrent[index];
      this.orderCurrent[index] = temp;
      this._orderSelected = -1;
      this._orderWon = false;
      this._renderOrderGame();
    }
  },

  // ===== Shared: Game Won Screen =====
  _showGameWon(gameName, xp, detail) {
    const area = document.getElementById('game-area');
    area.innerHTML = `
      <div style="max-width:500px;margin:0 auto;text-align:center;padding:var(--space-3xl) 0" class="animate-scale-in">
        <div style="font-size:80px;margin-bottom:var(--space-lg)">🏆</div>
        <h3 class="heading-2 mb-sm">${gameName} Complete!</h3>
        <p class="text-secondary mb-md">${detail}</p>
        <div class="quiz-results__xp" style="font-size:var(--text-2xl)">+${xp} XP</div>
        <div style="display:flex;gap:var(--space-md);justify-content:center;margin-top:var(--space-xl)">
          <button class="btn btn-primary" onclick="GamesPage.renderGamesList()">More Games</button>
          <button class="btn btn-secondary" onclick="Router.navigate('dashboard')">Dashboard</button>
        </div>
      </div>
    `;
  }
};

window.GamesPage = GamesPage;
