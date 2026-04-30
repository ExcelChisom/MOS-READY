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
          <div class="game-card__xp">⚡ +30 XP per win • FREE</div>
        </div>
      </div>

      <div class="game-card" onclick="GamesPage.startSpeedQuiz()">
        <div class="game-card__banner" style="background:var(--gradient-warm)">⚡</div>
        <div class="game-card__body">
          <div class="game-card__title">Speed Blitz</div>
          <div class="game-card__desc">Answer as many questions correctly in 60 seconds. Race against the clock!</div>
          <div class="game-card__xp">⚡ +5 XP per correct • FREE</div>
        </div>
      </div>

      <div class="game-card" onclick="GamesPage.startDragOrder()">
        <div class="game-card__banner" style="background:var(--gradient-accent)">📋</div>
        <div class="game-card__body">
          <div class="game-card__title">Step Sorter</div>
          <div class="game-card__desc">Put Word procedures in the correct order. Test your step-by-step knowledge!</div>
          <div class="game-card__xp">⚡ +25 XP per win • FREE</div>
        </div>
      </div>

      <div class="game-card" onclick="GamesPage.startTalkingBot()">
        <div class="game-card__banner" style="background:linear-gradient(135deg, #ffd166, #ff9f1c)">🐱🎙️</div>
        <div class="game-card__body">
          <div class="game-card__title">Talking Study Cat</div>
          <div class="game-card__desc">Say a shortcut or step out loud, and the AI cat repeats it back to drill your memory!</div>
          <div class="game-card__xp">⚡ +2 XP per word • FREE</div>
        </div>
      </div>

      <!-- PREMIUM GAMES SECTION -->
      <div style="grid-column:1/-1;margin:var(--space-lg) 0 var(--space-sm)">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-sm)">
          <div>
            <h3 class="heading-3" style="display:flex;align-items:center;gap:var(--space-sm)">
              <span style="background:var(--gradient-warm);-webkit-background-clip:text;-webkit-text-fill-color:transparent">👑 Premium Games</span>
            </h3>
            <p class="text-sm text-secondary">2 free trials per game • Brain-hacking games powered by active recall, clustering & spaced repetition</p>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-md)">
            ${PremiumGames.getPurchasedUses() > 0
              ? `<span class="badge badge-success" style="font-size:0.85rem;padding:6px 14px">🎮 ${PremiumGames.getPurchasedUses()} purchased plays</span>`
              : `<button class="btn btn-primary btn-sm" onclick="PremiumGames.showPaymentModal()">💳 Buy 5 plays — ₦250</button>`
            }
          </div>
        </div>
      </div>

      <div class="game-card" onclick="PremiumGames.tryStart('Millionaire', () => PremiumGames.millionaire.start())">
        <div class="game-card__banner" style="background:linear-gradient(135deg, #1a237e 0%, #7c5cfc 50%, #fee440 100%)">🏆</div>
        <div class="game-card__body">
          <div class="game-card__title">Who Wants to Be a Millionaire</div>
          <div class="game-card__desc">13 escalating questions with 3 lifelines: 50:50, Ask the Audience, Phone a Friend. Can you reach ₦1,000,000?</div>
          <div class="game-card__xp">⚡ Up to +100 XP • 👑 PREMIUM</div>
        </div>
      </div>

      <div class="game-card" onclick="PremiumGames.tryStart('Survival', () => PremiumGames.survival.start())">
        <div class="game-card__banner" style="background:linear-gradient(135deg, #b71c1c 0%, #f72585 100%)">🔫</div>
        <div class="game-card__body">
          <div class="game-card__title">Word Survival</div>
          <div class="game-card__desc">5 lives. 15 rounds. Every wrong answer costs a life. Use shields wisely. Can you survive the MOS Word battlefield?</div>
          <div class="game-card__xp">⚡ Up to +140 XP • 👑 PREMIUM</div>
        </div>
      </div>

      <div class="game-card" onclick="PremiumGames.tryStart('Cluster', () => PremiumGames.cluster.start())">
        <div class="game-card__banner" style="background:linear-gradient(135deg, #4caf50 0%, #00f5d4 100%)">🧠</div>
        <div class="game-card__body">
          <div class="game-card__title">Brain Cluster</div>
          <div class="game-card__desc">Group 16 MOS Word concepts into 4 correct clusters. Uses the clustering memory technique for deep learning!</div>
          <div class="game-card__xp">⚡ +40 XP per win • 👑 PREMIUM</div>
        </div>
      </div>

      <div class="game-card" onclick="PremiumGames.tryStart('Recall', () => PremiumGames.recall.start())">
        <div class="game-card__banner" style="background:linear-gradient(135deg, #ff6f00 0%, #fee440 100%)">⚡</div>
        <div class="game-card__body">
          <div class="game-card__title">Recall Rush</div>
          <div class="game-card__desc">Spaced repetition flashcards — rate your recall to build long-term memory. The science-backed way to learn!</div>
          <div class="game-card__xp">⚡ Up to +95 XP • 👑 PREMIUM</div>
        </div>
      </div>

      <div class="game-card" onclick="PremiumGames.tryStart('Tower', () => PremiumGames.tower.start())">
        <div class="game-card__banner" style="background:linear-gradient(135deg, #795548 0%, #ff6b35 100%)">🏗️</div>
        <div class="game-card__body">
          <div class="game-card__title">Word Tower</div>
          <div class="game-card__desc">Build a 12-floor tower by answering correctly! 3 wrong answers = tower collapses. Watch your tower grow in real-time!</div>
          <div class="game-card__xp">⚡ Up to +60 XP • 👑 PREMIUM</div>
        </div>
      </div>

      <div class="game-card" onclick="PremiumGames.tryStart('Runner', () => PremiumGames.runner.start())">
        <div class="game-card__banner" style="background:linear-gradient(135deg, #00b4d8 0%, #7c5cfc 50%, #f72585 100%)">🏃</div>
        <div class="game-card__body">
          <div class="game-card__title">MOS Word Runner</div>
          <div class="game-card__desc">Subway Surfer-style! Run through lanes, dodge wrong answers, grab the correct ones. Questions drop from above — how far can you go?</div>
          <div class="game-card__xp">⚡ Up to +120 XP • 👑 PREMIUM</div>
        </div>
      </div>
      
      <div class="game-card" onclick="PremiumGames.tryStart('Sniper', () => PremiumGames.sniper.start())">
        <div class="game-card__banner" style="background:linear-gradient(135deg, #1d3557 0%, #e63946 100%)">🎯</div>
        <div class="game-card__body">
          <div class="game-card__title">Answer Sniper (FreeFire Style)</div>
          <div class="game-card__desc">A high-stakes shooting gallery! Targets float across the screen with possible answers. Snipe the bot carrying the correct MOS answer!</div>
          <div class="game-card__xp">⚡ Up to +140 XP • 👑 PREMIUM</div>
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
  },

  // ===== TALKING BOT (ANGELA CLONE) =====
  startTalkingBot() {
    document.getElementById('games-list').style.display = 'none';
    const header = document.querySelector('#page-games .page__header');
    if(header) header.style.display = 'none';
    
    const area = document.getElementById('game-area');
    area.style.display = 'block';
    area.innerHTML = `
      <div class="quiz-container animate-fade-in" style="max-width:600px;text-align:center">
        <div class="lesson-breadcrumb" onclick="GamesPage.renderGamesList()" style="cursor:pointer;display:inline-block;margin-bottom:var(--space-md)">← Back to Games</div>
        <h3 class="heading-2 mb-md">Talking Study Cat 🐱</h3>
        <p class="text-secondary mb-md">Click the mic, read any Word shortcut, and this cat will repeat it to you in a funny voice to lock it into your memory!</p>
        
        <div id="cat-visual" style="font-size:120px; transition: transform 0.1s; height: 160px; display:flex; align-items:center; justify-content:center;">
          🐱
        </div>
        
        <div style="margin:20px 0; min-height: 40px; color: var(--accent-cyan); font-family: monospace; font-size: 1.2rem; background:rgba(0,0,0,0.3); padding:10px; border-radius:8px" id="cat-transcript">
          ... waiting for you ...
        </div>

        <button id="cat-mic-btn" class="btn btn-primary btn-lg" onclick="GamesPage._catListen()">🎤 Start Listening</button>
      </div>
    `;
  },

  async _catListen() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
       Toast.error('Your browser does not support Voice Recognition. Try Chrome or Edge.');
       return;
    }

    const btn = document.getElementById('cat-mic-btn');
    const visual = document.getElementById('cat-visual');
    const transcript = document.getElementById('cat-transcript');

    if (this._catRec) {
       this._catRec.stop();
       this._catRec = null;
       btn.textContent = '🎤 Start Listening';
       visual.textContent = '🐱';
       return;
    }

    // Explicitly request microphone access first (fixes iOS/Android silent failures)
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
         await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (err) {
      console.error("Mic access error:", err);
      Toast.error('Microphone access denied! Please allow access.');
      return;
    }

    const rec = new SpeechRecognition();
    this._catRec = rec;
    rec.lang = 'en-US';
    rec.interimResults = false;

    // AUDIO UNLOCK - Required for speech response later
    window.speechSynthesis.speak(new SpeechSynthesisUtterance("")); 


    rec.onstart = () => {
       btn.textContent = '🛑 Stop Listening';
       btn.style.background = '#e63946';
       visual.textContent = '🙀';
       visual.style.transform = 'scale(1.1)';
       transcript.textContent = '... tracking your voice ...';
    };

    rec.onresult = (event) => {
       const text = event.results[0][0].transcript;
       transcript.textContent = `You said: "${text}"`;
       
       rec.stop();
       this._catRec = null;
       btn.textContent = '🎤 Start Listening';
       btn.style.background = '';
       
       this._catSpeak(text);
       XP.award(10, 'Talking Study Cat Focus Drill');
    };

    rec.onerror = (event) => {
       transcript.textContent = `Error: ${event.error}`;
       this._catRec = null;
       btn.textContent = '🎤 Start Listening';
       btn.style.background = '';
       visual.textContent = '😿';
    };

    rec.onend = () => {
       this._catRec = null;
       btn.textContent = '🎤 Start Listening';
       btn.style.background = '';
    };

    rec.start();
  },

  _catSpeak(text) {
     try {
       const synth = window.speechSynthesis;
       const utterance = new SpeechSynthesisUtterance(text);
       
       const voices = synth.getVoices();
       const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Google'));
       if (femaleVoice) utterance.voice = femaleVoice;

       utterance.pitch = 1.9; // High pitch like Angela
       utterance.rate = 1.1;
       
       const visual = document.getElementById('cat-visual');
       
       // Lip sync simulation
       let syncInterval;
       utterance.onstart = () => {
         let mouthOpen = false;
         syncInterval = setInterval(() => {
            mouthOpen = !mouthOpen;
            if(visual) {
              visual.textContent = mouthOpen ? '😸' : '😺';
              visual.style.transform = mouthOpen ? 'scale(1.2)' : 'scale(1.0)';
            }
         }, 150);
       };

       utterance.onend = () => {
         clearInterval(syncInterval);
         if(visual) {
           visual.textContent = '🐱';
           visual.style.transform = 'scale(1.0)';
         }
       };

       utterance.onerror = (e) => {
         console.error('Speech synthesis error:', e);
         clearInterval(syncInterval);
         if(visual) visual.textContent = '😿';
       };

       synth.speak(utterance);
     } catch (err) {
       console.error("Cat Speak failed:", err);
       Toast.error("Failed to generate voice.");
     }
  }
};

window.GamesPage = GamesPage;
