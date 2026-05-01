/**
 * MOS-READY — Relax & Fun Games
 * Burger Builder (cooking game) + Virtual Monopoly
 */
window.RelaxGames = {

  // ==========================================
  // BURGER BUILDER (ShawarmaHelper-style cooking game)
  // ==========================================
  burgerState: null,

  startBurger() {
    const area = document.getElementById('relax-game-area');
    if (!area) return;

    const orders = [
      { name: 'Classic Burger', layers: ['bun-bottom','patty','lettuce','tomato','bun-top'], time: 20 },
      { name: 'Cheese Supreme', layers: ['bun-bottom','patty','cheese','patty','cheese','lettuce','bun-top'], time: 25 },
      { name: 'Veggie Deluxe', layers: ['bun-bottom','lettuce','tomato','onion','cheese','lettuce','bun-top'], time: 22 },
      { name: 'Double Stack', layers: ['bun-bottom','patty','cheese','patty','lettuce','tomato','onion','bun-top'], time: 30 },
      { name: 'BBQ Ranch', layers: ['bun-bottom','patty','onion','cheese','tomato','patty','lettuce','bun-top'], time: 28 },
    ];

    const order = orders[Math.floor(Math.random() * orders.length)];
    this.burgerState = {
      order: order,
      placed: [],
      score: 0,
      streak: 0,
      totalOrders: 0,
      maxOrders: 8,
      timeLeft: order.time,
      timer: null,
      gameOver: false
    };

    this._renderBurger();
    this._startBurgerTimer();
  },

  _startBurgerTimer() {
    const s = this.burgerState;
    if (s.timer) clearInterval(s.timer);
    s.timer = setInterval(() => {
      s.timeLeft--;
      const el = document.getElementById('burger-timer');
      if (el) el.textContent = s.timeLeft + 's';
      if (s.timeLeft <= 0) {
        clearInterval(s.timer);
        s.streak = 0;
        this._nextBurgerOrder();
      }
    }, 1000);
  },

  addLayer(layer) {
    const s = this.burgerState;
    if (!s || s.gameOver) return;
    const expected = s.order.layers[s.placed.length];
    s.placed.push(layer);
    this._renderBurger();

    if (s.placed.length === s.order.layers.length) {
      clearInterval(s.timer);
      // Check accuracy
      let correct = 0;
      for (let i = 0; i < s.order.layers.length; i++) {
        if (s.placed[i] === s.order.layers[i]) correct++;
      }
      const accuracy = Math.round((correct / s.order.layers.length) * 100);
      const points = accuracy >= 80 ? 10 + s.streak * 2 : accuracy >= 50 ? 5 : 0;
      s.score += points;
      if (accuracy >= 80) s.streak++;
      else s.streak = 0;
      if (window.Toast) Toast.success('Order done! ' + accuracy + '% accuracy → +' + points + ' pts');
      setTimeout(() => this._nextBurgerOrder(), 1500);
    }
  },

  _nextBurgerOrder() {
    const s = this.burgerState;
    s.totalOrders++;
    if (s.totalOrders >= s.maxOrders) {
      s.gameOver = true;
      if (window.XP) XP.award(s.score, 'Burger Builder');
      this._renderBurger();
      return;
    }
    const orders = [
      { name: 'Classic Burger', layers: ['bun-bottom','patty','lettuce','tomato','bun-top'], time: 18 },
      { name: 'Cheese Supreme', layers: ['bun-bottom','patty','cheese','patty','cheese','bun-top'], time: 22 },
      { name: 'Mega Stack', layers: ['bun-bottom','patty','cheese','onion','tomato','patty','lettuce','bun-top'], time: 28 },
    ];
    s.order = orders[Math.floor(Math.random() * orders.length)];
    s.placed = [];
    s.timeLeft = s.order.time;
    this._renderBurger();
    this._startBurgerTimer();
  },

  _renderBurger() {
    const area = document.getElementById('relax-game-area');
    const s = this.burgerState;
    if (!area || !s) return;

    const layerEmoji = { 'bun-top': '🍞', 'bun-bottom': '🍞', 'patty': '🥩', 'cheese': '🧀', 'lettuce': '🥬', 'tomato': '🍅', 'onion': '🧅' };
    const layerColor = { 'bun-top': '#e9c46a', 'bun-bottom': '#e9c46a', 'patty': '#8B4513', 'cheese': '#FFD700', 'lettuce': '#2d6a4f', 'tomato': '#e63946', 'onion': '#d8b4fe' };

    if (s.gameOver) {
      area.innerHTML = '<div style="text-align:center;padding:40px" class="animate-scale-in"><div style="font-size:64px;margin-bottom:16px">🍔</div><h3 class="heading-3">Kitchen Closed!</h3><p class="text-secondary" style="margin:10px 0">Final Score: ' + s.score + ' points · Streak: ' + s.streak + '</p><div style="display:flex;gap:10px;justify-content:center;margin-top:20px"><button class="btn btn-primary" onclick="RelaxGames.startBurger()">Play Again 🔄</button><button class="btn btn-secondary" onclick="RelaxGames.showMenu()">Back</button></div></div>';
      return;
    }

    area.innerHTML = '<div style="max-width:700px;margin:0 auto">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 class="heading-3">🍔 Burger Builder</h3><div style="display:flex;gap:10px"><span class="badge badge-success">Score: ' + s.score + '</span><span class="badge badge-warning" id="burger-timer">' + s.timeLeft + 's</span><span class="badge badge-primary">Order ' + (s.totalOrders + 1) + '/' + s.maxOrders + '</span></div></div>' +
      '<div class="glass-card" style="padding:16px;margin-bottom:16px"><p style="font-size:13px;opacity:0.6;margin-bottom:6px">📋 ORDER: ' + s.order.name + '</p><div style="display:flex;gap:6px;flex-wrap:wrap">' +
      s.order.layers.map(l => '<span style="background:' + layerColor[l] + '33;border:1px solid ' + layerColor[l] + ';padding:4px 10px;border-radius:6px;font-size:12px">' + layerEmoji[l] + ' ' + l + '</span>').join('') +
      '</div></div>' +
      '<div class="glass-card" style="padding:20px;margin-bottom:16px;min-height:200px;display:flex;flex-direction:column-reverse;align-items:center;gap:4px">' +
      s.placed.map(l => '<div style="width:120px;padding:8px;text-align:center;background:' + layerColor[l] + '44;border:2px solid ' + layerColor[l] + ';border-radius:8px;font-size:14px">' + layerEmoji[l] + ' ' + l + '</div>').join('') +
      (s.placed.length === 0 ? '<p style="opacity:0.3;font-size:13px">Start stacking! Add layers below.</p>' : '') +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">' +
      Object.keys(layerEmoji).map(l => '<button class="btn btn-secondary" onclick="RelaxGames.addLayer(\'' + l + '\')" style="padding:10px 16px;font-size:13px">' + layerEmoji[l] + ' ' + l + '</button>').join('') +
      '</div></div>';
  },

  // ==========================================
  // MONOPOLY (Local / Pass-and-Play + CPU)
  // ==========================================
  monoState: null,

  startMonopoly(mode) {
    // mode: 'solo' (vs CPU), 'local' (pass-and-play 2p)
    const properties = [
      { name: 'GO', type: 'go', color: '#fff', price: 0 },
      { name: 'Ribbon Ave', type: 'prop', color: '#8B4513', price: 60 },
      { name: 'Font Lane', type: 'prop', color: '#8B4513', price: 60 },
      { name: 'Tax Office', type: 'tax', color: '#555', price: 200 },
      { name: 'Styles Blvd', type: 'prop', color: '#87CEEB', price: 100 },
      { name: 'Table Row', type: 'prop', color: '#87CEEB', price: 120 },
      { name: 'Free Parking', type: 'free', color: '#2a9d8f', price: 0 },
      { name: 'Header Heights', type: 'prop', color: '#FF69B4', price: 140 },
      { name: 'Margin Walk', type: 'prop', color: '#FF69B4', price: 160 },
      { name: 'Chance', type: 'chance', color: '#f72585', price: 0 },
      { name: 'Layout Lane', type: 'prop', color: '#FFA500', price: 180 },
      { name: 'Bookmark Dr', type: 'prop', color: '#FFA500', price: 200 },
      { name: 'Go To Jail', type: 'jail', color: '#e63946', price: 0 },
      { name: 'Reference Rd', type: 'prop', color: '#00FF00', price: 220 },
      { name: 'Macro Manor', type: 'prop', color: '#00FF00', price: 240 },
      { name: 'Community', type: 'chance', color: '#7c5cfc', price: 0 },
      { name: 'Template Terr', type: 'prop', color: '#0000FF', price: 260 },
      { name: 'Review Way', type: 'prop', color: '#0000FF', price: 280 },
      { name: 'Super Tax', type: 'tax', color: '#555', price: 100 },
      { name: 'MOS Cert HQ', type: 'prop', color: '#FFD700', price: 400 },
    ];

    const players = [
      { name: 'You', emoji: '🎯', money: 1500, pos: 0, owned: [], isCpu: false, jailed: 0 },
    ];
    if (mode === 'solo') {
      players.push({ name: 'CPU', emoji: '🤖', money: 1500, pos: 0, owned: [], isCpu: true, jailed: 0 });
    } else {
      players.push({ name: 'Player 2', emoji: '🎲', money: 1500, pos: 0, owned: [], isCpu: false, jailed: 0 });
    }

    this.monoState = {
      board: properties,
      players: players,
      current: 0,
      dice: [0, 0],
      message: 'Roll the dice to start!',
      log: [],
      gameOver: false,
      turnPhase: 'roll' // 'roll', 'action', 'done'
    };

    this._renderMono();
  },

  monoRoll() {
    const s = this.monoState;
    if (!s || s.gameOver || s.turnPhase !== 'roll') return;
    const p = s.players[s.current];

    if (p.jailed > 0) {
      p.jailed--;
      s.message = p.name + ' is in jail! ' + p.jailed + ' turns left.';
      s.log.unshift(p.emoji + ' ' + p.name + ' stuck in jail.');
      this._monoEndTurn();
      return;
    }

    s.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    const total = s.dice[0] + s.dice[1];
    p.pos = (p.pos + total) % s.board.length;

    // Pass GO
    if (p.pos < total) { p.money += 200; s.log.unshift(p.emoji + ' passed GO! +$200'); }

    const tile = s.board[p.pos];
    s.message = p.name + ' rolled ' + s.dice[0] + '+' + s.dice[1] + ' = ' + total + ' → landed on ' + tile.name;
    s.log.unshift(p.emoji + ' rolled ' + total + ' → ' + tile.name);

    // Handle tile
    if (tile.type === 'prop') {
      const owner = s.players.find(pl => pl.owned.includes(p.pos));
      if (owner && owner !== p) {
        const rent = Math.floor(tile.price * 0.25);
        p.money -= rent;
        owner.money += rent;
        s.message += '. Paid $' + rent + ' rent to ' + owner.name;
        s.log.unshift(p.emoji + ' paid $' + rent + ' rent to ' + owner.emoji);
        this._monoEndTurn();
      } else if (!owner) {
        s.turnPhase = 'action';
        s.message += '. Buy for $' + tile.price + '?';
        if (p.isCpu) {
          // CPU auto-buys if affordable
          if (p.money >= tile.price && Math.random() < 0.8) {
            this.monoBuy();
          } else {
            this._monoEndTurn();
          }
          return;
        }
        this._renderMono();
        return;
      } else {
        this._monoEndTurn();
      }
    } else if (tile.type === 'tax') {
      p.money -= tile.price;
      s.log.unshift(p.emoji + ' paid $' + tile.price + ' tax!');
      this._monoEndTurn();
    } else if (tile.type === 'jail') {
      p.jailed = 3;
      p.pos = 6; // Free parking acts as jail position
      s.log.unshift(p.emoji + ' sent to jail for 3 turns!');
      this._monoEndTurn();
    } else if (tile.type === 'chance') {
      const events = [
        { text: 'Bank pays you $100!', money: 100 },
        { text: 'Pay hospital fees $50', money: -50 },
        { text: 'Birthday! Collect $25 from each player', money: 25 * (s.players.length - 1) },
        { text: 'Speeding fine $15', money: -15 },
        { text: 'Won quiz competition! +$150', money: 150 },
      ];
      const ev = events[Math.floor(Math.random() * events.length)];
      p.money += ev.money;
      s.message += '. ' + ev.text;
      s.log.unshift(p.emoji + ' ' + ev.text);
      this._monoEndTurn();
    } else {
      this._monoEndTurn();
    }
  },

  monoBuy() {
    const s = this.monoState;
    if (!s || s.turnPhase !== 'action') return;
    const p = s.players[s.current];
    const tile = s.board[p.pos];
    if (p.money >= tile.price) {
      p.money -= tile.price;
      p.owned.push(p.pos);
      s.log.unshift(p.emoji + ' bought ' + tile.name + ' for $' + tile.price);
    }
    this._monoEndTurn();
  },

  monoSkip() {
    const s = this.monoState;
    if (!s) return;
    this._monoEndTurn();
  },

  _monoEndTurn() {
    const s = this.monoState;
    // Check bankruptcy
    const bankrupt = s.players.find(p => p.money < 0);
    if (bankrupt) {
      s.gameOver = true;
      const winner = s.players.find(p => p !== bankrupt);
      s.message = bankrupt.name + ' is bankrupt! ' + (winner ? winner.name + ' wins!' : 'Game over!');
      if (window.XP) XP.award(20, 'Monopoly Game');
      this._renderMono();
      return;
    }
    s.current = (s.current + 1) % s.players.length;
    s.turnPhase = 'roll';
    s.message = s.players[s.current].name + '\'s turn. Roll the dice!';
    this._renderMono();

    // Auto-roll for CPU
    if (s.players[s.current].isCpu && !s.gameOver) {
      setTimeout(() => this.monoRoll(), 1500);
    }
  },

  _renderMono() {
    const area = document.getElementById('relax-game-area');
    const s = this.monoState;
    if (!area || !s) return;

    if (s.gameOver) {
      area.innerHTML = '<div style="text-align:center;padding:40px"><div style="font-size:64px;margin-bottom:16px">🏆</div><h3 class="heading-3">' + s.message + '</h3><div style="display:flex;gap:10px;justify-content:center;margin-top:20px"><button class="btn btn-primary" onclick="RelaxGames.startMonopoly(\'solo\')">Play Again</button><button class="btn btn-secondary" onclick="RelaxGames.showMenu()">Back</button></div></div>';
      return;
    }

    const cp = s.players[s.current];
    let boardHTML = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:16px">';
    s.board.forEach((tile, i) => {
      const playersHere = s.players.filter(p => p.pos === i).map(p => p.emoji).join('');
      const owner = s.players.find(p => p.owned.includes(i));
      boardHTML += '<div style="padding:6px;background:' + tile.color + '22;border:1px solid ' + tile.color + '55;border-radius:6px;font-size:10px;text-align:center;min-height:50px;position:relative' + (i === cp.pos ? ';box-shadow:0 0 8px #00f5d4' : '') + '"><div style="font-weight:700;line-height:1.2">' + tile.name + '</div>' + (tile.price > 0 ? '<div style="opacity:0.5">$' + tile.price + '</div>' : '') + (playersHere ? '<div style="font-size:16px;position:absolute;top:2px;right:4px">' + playersHere + '</div>' : '') + (owner ? '<div style="font-size:8px;position:absolute;bottom:2px;right:4px;background:' + tile.color + '44;padding:1px 4px;border-radius:4px">' + owner.emoji + '</div>' : '') + '</div>';
    });
    boardHTML += '</div>';

    let playersHTML = '<div style="display:flex;gap:12px;margin-bottom:16px">';
    s.players.forEach(p => {
      playersHTML += '<div class="glass-card" style="flex:1;padding:12px;' + (p === cp ? 'border:2px solid #00f5d4' : '') + '"><div style="font-size:20px;margin-bottom:4px">' + p.emoji + ' ' + p.name + '</div><div style="font-size:18px;font-weight:700;color:#00f5d4">$' + p.money + '</div><div style="font-size:11px;opacity:0.5">' + p.owned.length + ' properties</div></div>';
    });
    playersHTML += '</div>';

    const diceHTML = s.dice[0] > 0 ? '<span style="font-size:28px;margin-right:8px">🎲' + s.dice[0] + '</span><span style="font-size:28px">🎲' + s.dice[1] + '</span>' : '';

    let actionsHTML = '';
    if (s.turnPhase === 'roll' && !cp.isCpu) {
      actionsHTML = '<button class="btn btn-primary" onclick="RelaxGames.monoRoll()" style="font-size:16px;padding:12px 30px">🎲 Roll Dice</button>';
    } else if (s.turnPhase === 'action' && !cp.isCpu) {
      const tile = s.board[cp.pos];
      actionsHTML = '<button class="btn btn-primary" onclick="RelaxGames.monoBuy()" style="margin-right:8px">Buy $' + tile.price + '</button><button class="btn btn-secondary" onclick="RelaxGames.monoSkip()">Skip</button>';
    }

    const logHTML = s.log.slice(0, 6).map(l => '<div style="font-size:11px;opacity:0.6;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.05)">' + l + '</div>').join('');

    area.innerHTML = '<div style="max-width:800px;margin:0 auto">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 class="heading-3">🏘️ MOS Monopoly</h3><button class="btn btn-secondary btn-sm" onclick="RelaxGames.showMenu()">← Back</button></div>' +
      playersHTML + boardHTML +
      '<div style="text-align:center;margin-bottom:12px">' + diceHTML + '</div>' +
      '<div style="text-align:center;padding:12px;background:rgba(0,245,212,0.08);border-radius:8px;font-size:14px;font-weight:600;margin-bottom:12px">' + s.message + '</div>' +
      '<div style="text-align:center;margin-bottom:16px">' + actionsHTML + '</div>' +
      '<div class="glass-card" style="padding:12px"><p style="font-size:12px;font-weight:700;margin-bottom:8px">📜 Game Log</p>' + logHTML + '</div></div>';
  },

  // ==========================================
  // MENU
  // ==========================================
  showMenu() {
    const area = document.getElementById('relax-game-area');
    if (!area) return;
    area.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">' +
      '<div class="glass-card" style="cursor:pointer;padding:30px;text-align:center;transition:all 0.2s" onclick="RelaxGames.startBurger()" onmouseover="this.style.borderColor=\'#e9c46a\'" onmouseout="this.style.borderColor=\'transparent\'">' +
      '<div style="font-size:64px;margin-bottom:12px">🍔</div><h4 class="heading-4">Burger Builder</h4><p class="text-secondary text-sm" style="margin-top:8px">Stack burgers against the clock! Match the order perfectly for bonus points.</p><span class="badge badge-success" style="margin-top:12px">8 Orders · Free</span></div>' +
      '<div class="glass-card" style="padding:30px;text-align:center">' +
      '<div style="font-size:64px;margin-bottom:12px">🏘️</div><h4 class="heading-4">MOS Monopoly</h4><p class="text-secondary text-sm" style="margin-top:8px">Buy Word properties, collect rent, and bankrupt your opponent!</p>' +
      '<div style="display:flex;gap:8px;justify-content:center;margin-top:12px"><button class="btn btn-primary btn-sm" onclick="RelaxGames.startMonopoly(\'solo\')">vs CPU 🤖</button><button class="btn btn-secondary btn-sm" onclick="RelaxGames.startMonopoly(\'local\')">2 Players 🎲</button></div></div>' +
      '</div>';
  }
};
