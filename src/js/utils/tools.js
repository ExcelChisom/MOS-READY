/**
 * MOS-READY — Productivity Tools
 * Scientific Calculator, Study Timer, External Playlist
 */
window.AppTools = {
  calcExp: '',
  calcResult: '',
  timerInt: null,
  timeLeft: 0,

  // ==========================================
  // SCIENTIFIC CALCULATOR (fully functional)
  // ==========================================
  toggleCalc() {
    const el = document.getElementById('calc-panel');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },

  calcInput(val) {
    const display = document.getElementById('calc-display');
    const preview = document.getElementById('calc-preview');
    if (!display) return;

    // Clear
    if (val === 'C') {
      this.calcExp = '';
      this.calcResult = '';
      display.textContent = '0';
      if (preview) preview.textContent = '';
      return;
    }

    // Backspace
    if (val === 'DEL') {
      this.calcExp = this.calcExp.slice(0, -1);
      display.textContent = this.calcExp || '0';
      return;
    }

    // Evaluate
    if (val === '=') {
      try {
        const result = this._evaluate(this.calcExp);
        if (preview) preview.textContent = this.calcExp + ' =';
        this.calcResult = result;
        this.calcExp = result.toString();
        display.textContent = this.calcExp;
      } catch (err) {
        display.textContent = 'Error';
        this.calcExp = '';
      }
      return;
    }

    // Special functions that wrap the expression
    const wrapFns = ['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'log(', 'ln(', 'sqrt(', 'abs(', 'exp(', 'cbrt('];
    if (wrapFns.includes(val)) {
      this.calcExp += val;
      display.textContent = this.calcExp;
      return;
    }

    // Constants
    if (val === 'PI') { this.calcExp += 'PI'; display.textContent = this.calcExp; return; }
    if (val === 'E') { this.calcExp += 'E'; display.textContent = this.calcExp; return; }

    // Factorial
    if (val === '!') { this.calcExp += '!'; display.textContent = this.calcExp; return; }

    // Power
    if (val === '^') { this.calcExp += '^'; display.textContent = this.calcExp; return; }

    // Square
    if (val === 'x2') { this.calcExp += '^2'; display.textContent = this.calcExp; return; }

    // Inverse (1/x)
    if (val === '1/x') {
      try {
        const v = this._evaluate(this.calcExp);
        if (v === 0) { display.textContent = 'Error: Div/0'; this.calcExp = ''; return; }
        const result = 1 / v;
        if (preview) preview.textContent = '1/(' + this.calcExp + ') =';
        this.calcExp = result.toString();
        display.textContent = this.calcExp;
      } catch (e) { display.textContent = 'Error'; this.calcExp = ''; }
      return;
    }

    // Negate
    if (val === '+/-') {
      if (this.calcExp.startsWith('-')) this.calcExp = this.calcExp.substring(1);
      else if (this.calcExp) this.calcExp = '-' + this.calcExp;
      display.textContent = this.calcExp || '0';
      return;
    }

    // Percentage
    if (val === '%') {
      try {
        const v = this._evaluate(this.calcExp);
        this.calcExp = (v / 100).toString();
        display.textContent = this.calcExp;
      } catch (e) { display.textContent = 'Error'; }
      return;
    }

    // Default: append character
    this.calcExp += val;
    display.textContent = this.calcExp;
  },

  _evaluate(expr) {
    if (!expr || expr.trim() === '') return 0;

    // Replace display symbols with JS equivalents
    let e = expr;
    e = e.replace(/PI/g, '(Math.PI)');
    e = e.replace(/E(?![a-z])/g, '(Math.E)');
    e = e.replace(/sin\(/g, 'Math.sin(');
    e = e.replace(/cos\(/g, 'Math.cos(');
    e = e.replace(/tan\(/g, 'Math.tan(');
    e = e.replace(/asin\(/g, 'Math.asin(');
    e = e.replace(/acos\(/g, 'Math.acos(');
    e = e.replace(/atan\(/g, 'Math.atan(');
    e = e.replace(/log\(/g, 'Math.log10(');
    e = e.replace(/ln\(/g, 'Math.log(');
    e = e.replace(/sqrt\(/g, 'Math.sqrt(');
    e = e.replace(/cbrt\(/g, 'Math.cbrt(');
    e = e.replace(/abs\(/g, 'Math.abs(');
    e = e.replace(/exp\(/g, 'Math.exp(');

    // Handle factorial
    e = e.replace(/(\d+)!/g, function(m, n) {
      let f = 1; for (let i = 2; i <= parseInt(n); i++) f *= i;
      return f.toString();
    });

    // Handle power operator ^
    while (e.includes('^')) {
      e = e.replace(/([0-9.]+|\([^)]+\))\^([0-9.]+|\([^)]+\))/, 'Math.pow($1,$2)');
      // Safety break
      if (!e.includes('^')) break;
      // If still has ^, try a simpler replacement
      e = e.replace(/\^/, '**');
    }

    // Handle × and ÷ symbols
    e = e.replace(/×/g, '*');
    e = e.replace(/÷/g, '/');

    const result = new Function('return ' + e)();
    if (typeof result !== 'number' || !isFinite(result)) throw new Error('Invalid');

    // Format: integers stay as-is, decimals get max 10 sig figs
    if (Number.isInteger(result)) return result;
    const r = parseFloat(result.toPrecision(10));
    return r;
  },

  // ==========================================
  // STUDY TIMER
  // ==========================================
  toggleTimer() {
    const el = document.getElementById('timer-panel');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },

  startTimer() {
    const btn = document.getElementById('timer-start-btn');
    if (this.timerInt) {
      clearInterval(this.timerInt);
      this.timerInt = null;
      if (btn) btn.textContent = 'Start';
      return;
    }

    if (this.timeLeft <= 0) {
      const mins = parseInt(document.getElementById('timer-minutes').value) || 25;
      this.timeLeft = mins * 60;
    }

    if (btn) btn.textContent = 'Pause';
    this.timerInt = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInt);
        this.timerInt = null;
        if (btn) btn.textContent = 'Start';
        document.getElementById('timer-display').textContent = '00:00';
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance('Time up! Great job studying!');
        synth.speak(utterance);
        if (window.Toast) Toast.success('⏰ Time up! Great job studying!');
        if (window.Confetti) Confetti.burst();
        return;
      }
      const m = Math.floor(this.timeLeft / 60);
      const s = this.timeLeft % 60;
      document.getElementById('timer-display').textContent = m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
    }, 1000);
  },

  resetTimer() {
    if (this.timerInt) clearInterval(this.timerInt);
    this.timerInt = null;
    this.timeLeft = 0;
    const btn = document.getElementById('timer-start-btn');
    if (btn) btn.textContent = 'Start';
    const mins = document.getElementById('timer-minutes').value || 25;
    document.getElementById('timer-display').textContent = mins.toString().padStart(2, '0') + ':00';
  },

  // ==========================================
  // EXTERNAL PLAYLIST
  // ==========================================
  togglePlaylist() {
    const el = document.getElementById('playlist-panel');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },

  loadPlaylist() {
    const input = document.getElementById('playlist-url');
    const player = document.getElementById('playlist-player');
    if (!input || !player) return;
    const url = input.value.trim();
    if (!url) { if (window.Toast) Toast.error('Enter a playlist URL!'); return; }

    // Show distraction warning
    if (window.Toast) Toast.warning('⚠️ External music may distract from real exam conditions. Use focus music for better results!', { duration: 6000 });

    let embedUrl = '';
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:list=|v=)([\w-]+)/);
      if (match) embedUrl = 'https://www.youtube.com/embed/?list=' + match[1];
      else embedUrl = url.replace('watch?v=', 'embed/');
    }
    // Spotify
    else if (url.includes('spotify.com')) {
      embedUrl = url.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    // SoundCloud
    else if (url.includes('soundcloud.com')) {
      embedUrl = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) + '&auto_play=true';
    }
    // Direct audio URL
    else if (url.match(/\.(mp3|ogg|wav|m4a|aac)$/i)) {
      player.innerHTML = '<audio controls autoplay style="width:100%" src="' + url + '"></audio>';
      return;
    }
    // Fallback: try as iframe
    else {
      embedUrl = url;
    }

    player.innerHTML = '<iframe src="' + embedUrl + '" style="width:100%;height:80px;border:none;border-radius:8px" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
  }
};
