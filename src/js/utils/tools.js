/**
 * MOS-READY — Productivity Tools
 * Scientific Calculator, Study Timer, External Playlist
 */
window.AppTools = {
  calcExp: '',
  calcResult: '',
  calcHistory: '',
  timerInt: null,
  timeLeft: 0,

  // ==========================================
  // SCIENTIFIC CALCULATOR
  // ==========================================
  toggleCalc() {
    const el = document.getElementById('calc-panel');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },

  calcInput(val) {
    const display = document.getElementById('calc-display');
    const preview = document.getElementById('calc-preview');
    if (!display) return;

    if (val === 'C') {
      this.calcExp = '';
      display.textContent = '0';
      if (preview) preview.textContent = '';
      return;
    }
    if (val === 'DEL') {
      // Remove last token intelligently
      const fns = ['sin(','cos(','tan(','asin(','acos(','atan(','log(','ln(','sqrt(','abs(','exp(','cbrt('];
      let removed = false;
      for (const fn of fns) {
        if (this.calcExp.endsWith(fn)) {
          this.calcExp = this.calcExp.slice(0, -fn.length);
          removed = true;
          break;
        }
      }
      if (!removed) this.calcExp = this.calcExp.slice(0, -1);
      display.textContent = this.calcExp || '0';
      return;
    }
    if (val === '=') {
      if (!this.calcExp) return;
      try {
        const result = this._eval(this.calcExp);
        if (preview) preview.textContent = this.calcExp + ' =';
        this.calcExp = String(result);
        display.textContent = this.calcExp;
      } catch (err) {
        display.textContent = 'Error';
        if (preview) preview.textContent = this.calcExp;
        this.calcExp = '';
      }
      return;
    }
    // 1/x
    if (val === '1/x') {
      if (!this.calcExp) return;
      try {
        const v = this._eval(this.calcExp);
        if (v === 0) { display.textContent = 'Cannot divide by 0'; this.calcExp = ''; return; }
        if (preview) preview.textContent = '1/(' + this.calcExp + ') =';
        this.calcExp = String(1 / v);
        display.textContent = this.calcExp;
      } catch (e) { display.textContent = 'Error'; this.calcExp = ''; }
      return;
    }
    // x²
    if (val === 'x2') {
      if (!this.calcExp) return;
      try {
        const v = this._eval(this.calcExp);
        if (preview) preview.textContent = '(' + this.calcExp + ')² =';
        this.calcExp = String(v * v);
        display.textContent = this.calcExp;
      } catch (e) { display.textContent = 'Error'; this.calcExp = ''; }
      return;
    }
    // ±
    if (val === '+/-') {
      if (!this.calcExp) return;
      if (this.calcExp.startsWith('-')) this.calcExp = this.calcExp.substring(1);
      else this.calcExp = '-' + this.calcExp;
      display.textContent = this.calcExp;
      return;
    }
    // %
    if (val === '%') {
      if (!this.calcExp) return;
      try {
        const v = this._eval(this.calcExp);
        if (preview) preview.textContent = this.calcExp + '% =';
        this.calcExp = String(v / 100);
        display.textContent = this.calcExp;
      } catch (e) { display.textContent = 'Error'; }
      return;
    }
    // n!
    if (val === '!') {
      if (!this.calcExp) return;
      try {
        const v = this._eval(this.calcExp);
        const n = Math.round(v);
        if (n < 0 || n > 170) { display.textContent = 'Error'; return; }
        let f = 1; for (let i = 2; i <= n; i++) f *= i;
        if (preview) preview.textContent = n + '! =';
        this.calcExp = String(f);
        display.textContent = this.calcExp;
      } catch (e) { display.textContent = 'Error'; this.calcExp = ''; }
      return;
    }
    // Default: append
    this.calcExp += val;
    display.textContent = this.calcExp;
  },

  _eval(expr) {
    if (!expr || !expr.trim()) return 0;
    let e = expr;
    // Replace constants
    e = e.replace(/\bPI\b/g, String(Math.PI));
    e = e.replace(/\bE\b/g, String(Math.E));
    // Replace functions
    e = e.replace(/\basin\(/g, 'Math.asin(');
    e = e.replace(/\bacos\(/g, 'Math.acos(');
    e = e.replace(/\batan\(/g, 'Math.atan(');
    e = e.replace(/\bsin\(/g, 'Math.sin(');
    e = e.replace(/\bcos\(/g, 'Math.cos(');
    e = e.replace(/\btan\(/g, 'Math.tan(');
    e = e.replace(/\blog\(/g, 'Math.log10(');
    e = e.replace(/\bln\(/g, 'Math.log(');
    e = e.replace(/\bsqrt\(/g, 'Math.sqrt(');
    e = e.replace(/\bcbrt\(/g, 'Math.cbrt(');
    e = e.replace(/\babs\(/g, 'Math.abs(');
    e = e.replace(/\bexp\(/g, 'Math.exp(');
    // Replace ^ with **
    e = e.replace(/\^/g, '**');
    // Replace × ÷ − with JS operators
    e = e.replace(/×/g, '*');
    e = e.replace(/÷/g, '/');
    e = e.replace(/−/g, '-');
    const result = new Function('return (' + e + ')')();
    if (typeof result !== 'number' || !isFinite(result)) throw new Error('Bad');
    // Clean formatting
    if (Number.isInteger(result)) return result;
    return parseFloat(result.toPrecision(12));
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
    if (this.timerInt) { clearInterval(this.timerInt); this.timerInt = null; if (btn) btn.textContent = 'Start'; return; }
    if (this.timeLeft <= 0) { const mins = parseInt(document.getElementById('timer-minutes').value) || 25; this.timeLeft = mins * 60; }
    if (btn) btn.textContent = 'Pause';
    this.timerInt = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInt); this.timerInt = null;
        if (btn) btn.textContent = 'Start';
        document.getElementById('timer-display').textContent = '00:00';
        try { window.speechSynthesis.speak(new SpeechSynthesisUtterance('Time is up! Great job studying!')); } catch(e){}
        if (window.Toast) Toast.success('⏰ Time up!');
        if (window.Confetti) Confetti.burst();
        return;
      }
      const m = Math.floor(this.timeLeft / 60), s = this.timeLeft % 60;
      document.getElementById('timer-display').textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
    }, 1000);
  },
  resetTimer() {
    if (this.timerInt) clearInterval(this.timerInt); this.timerInt = null; this.timeLeft = 0;
    const btn = document.getElementById('timer-start-btn'); if (btn) btn.textContent = 'Start';
    const mins = document.getElementById('timer-minutes').value || 25;
    document.getElementById('timer-display').textContent = String(mins).padStart(2,'0') + ':00';
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
    if (!url) { if (window.Toast) Toast.error('Paste a URL or use the file picker below!'); return; }
    if (window.Toast) Toast.warning('⚠️ External music may distract from real exam simulation. Built-in Focus Music is better for prep!');
    let html = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let vid = ''; let list = '';
      const vm = url.match(/[?&]v=([\w-]+)/); if (vm) vid = vm[1];
      const lm = url.match(/[?&]list=([\w-]+)/); if (lm) list = lm[1];
      if (!vid) { const sm = url.match(/youtu\.be\/([\w-]+)/); if (sm) vid = sm[1]; }
      if (list) html = '<iframe src="https://www.youtube.com/embed/videoseries?list=' + list + '&autoplay=1" style="width:100%;height:200px;border:none;border-radius:8px" allow="autoplay;encrypted-media" allowfullscreen></iframe>';
      else if (vid) html = '<iframe src="https://www.youtube.com/embed/' + vid + '?autoplay=1" style="width:100%;height:200px;border:none;border-radius:8px" allow="autoplay;encrypted-media" allowfullscreen></iframe>';
      else html = '<p style="color:#f72585;font-size:13px">Could not parse YouTube URL. Try a direct video or playlist link.</p>';
    } else if (url.includes('spotify.com')) {
      const embed = url.replace('open.spotify.com/', 'open.spotify.com/embed/');
      html = '<iframe src="' + embed + '" style="width:100%;height:152px;border:none;border-radius:12px" allow="autoplay;encrypted-media;clipboard-write" allowfullscreen></iframe>';
    } else if (url.includes('soundcloud.com')) {
      html = '<iframe src="https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) + '&auto_play=true&color=%237c5cfc" style="width:100%;height:166px;border:none" allow="autoplay"></iframe>';
    } else if (url.match(/\.(mp3|ogg|wav|m4a|aac|flac|webm)(\?.*)?$/i)) {
      html = '<audio controls autoplay style="width:100%;border-radius:8px" src="' + url + '"></audio>';
    } else {
      html = '<iframe src="' + url + '" style="width:100%;height:200px;border:none;border-radius:8px" allow="autoplay" sandbox="allow-scripts allow-same-origin"></iframe>';
    }
    player.innerHTML = html;
  },
  loadLocalFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = () => {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      const url = URL.createObjectURL(file);
      const player = document.getElementById('playlist-player');
      if (player) {
        player.innerHTML = '<div style="font-size:13px;margin-bottom:8px;opacity:0.7">🎵 ' + file.name + '</div><audio controls autoplay style="width:100%;border-radius:8px" src="' + url + '"></audio>';
      }
      if (window.Toast) Toast.success('Playing: ' + file.name);
    };
    input.click();
  }
};
