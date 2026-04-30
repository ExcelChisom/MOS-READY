window.AppTools = {
  calcExp: '',
  timerInt: null,
  timeLeft: 0,
  
  toggleCalc() {
    const el = document.getElementById('calc-panel');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },
  
  calcInput(val) {
    const display = document.getElementById('calc-display');
    if (val === 'clear') {
      this.calcExp = '';
      display.textContent = '0';
      return;
    }
    
    if (val === '=') {
      try {
        let e = this.calcExp.replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/tan/g, 'Math.tan').replace(/log/g, 'Math.log10').replace(/sqrt/g, 'Math.sqrt');
        if(e.includes('^')) {
           let parts = e.split('^');
           e = `Math.pow(${parts[0]}, ${parts[1]})`;
        }
        const result = new Function('return ' + e)();
        this.calcExp = Number.isInteger(result) ? result.toString() : parseFloat(result).toFixed(4);
      } catch(err) {
        this.calcExp = 'Error';
      }
      display.textContent = this.calcExp;
      return;
    }
    
    this.calcExp += val;
    display.textContent = this.calcExp;
  },
  
  toggleTimer() {
    const el = document.getElementById('timer-panel');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },
  
  startTimer() {
    const btn = document.getElementById('timer-start-btn');
    if (this.timerInt) {
      clearInterval(this.timerInt);
      this.timerInt = null;
      btn.textContent = 'Start';
      return;
    }
    
    if (this.timeLeft <= 0) {
      const mins = parseInt(document.getElementById('timer-minutes').value) || 25;
      this.timeLeft = mins * 60;
    }
    
    btn.textContent = 'Pause';
    this.timerInt = setInterval(() => {
      this.timeLeft--;
      if(this.timeLeft <= 0) {
         clearInterval(this.timerInt);
         this.timerInt = null;
         btn.textContent = 'Start';
         document.getElementById('timer-display').textContent = "00:00";
         
         const synth = window.speechSynthesis;
         const utterance = new SpeechSynthesisUtterance("Time up! Great job studying!");
         synth.speak(utterance);
         if(window.Toast) Toast.success("Time up!");
         return;
      }
      
      const m = Math.floor(this.timeLeft / 60);
      const s = this.timeLeft % 60;
      document.getElementById('timer-display').textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
  },
  
  resetTimer() {
    if(this.timerInt) clearInterval(this.timerInt);
    this.timerInt = null;
    this.timeLeft = 0;
    document.getElementById('timer-start-btn').textContent = 'Start';
    const mins = document.getElementById('timer-minutes').value || 25;
    document.getElementById('timer-display').textContent = `${mins.toString().padStart(2,'0')}:00`;
  }
};
