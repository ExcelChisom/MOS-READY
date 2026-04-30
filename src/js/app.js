/**
 * MOS-READY MAIN CONTROLLER
 * Orchestrates routing, navigation, state, and security
 */

// ==========================================
// ANTI-TAMPER SECURITY (Prevents basic source code inspection)
// ==========================================
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
    e.preventDefault();
  }
});

(function () {
  'use strict';

  function init() {
    // Initialize all systems
    Toast.init();
    Confetti.init();
    XP.updateStreak();
    XP.updateUI();

    // Initialize pages
    DashboardPage.init();
    LearnPage.init();
    if(window.GamesPage) window.GamesPage.init();
    if(window.Resources) window.Resources.init();
    QuizzesPage.init();
    MockExamPage.init();
    PracticeExamPage.init();
    WordLabPage.init();

    // Initialize router (last, so page callbacks are registered)
    Router.init();

    AntiCheat.init();
    BackgroundWorkers.init();

    console.log('🎯 MOS-READY initialized');
  }

  const BackgroundWorkers = {
    init() {
      this._initAudio();
      this._initHourlyQuote();
    },
    
    _initAudio() {
      this.isAudioPlaying = false;
      const audio = document.getElementById('focus-audio');
      const btn = document.getElementById('focus-music-btn');
      if (!audio || !btn) return;
      
      // Auto-play attempt on first user interaction
      const startAudio = () => {
         if (!this.isAudioPlaying) {
             audio.volume = 0.4;
             audio.play().then(() => {
                this.isAudioPlaying = true;
                btn.innerHTML = '🎵 Focus On';
                btn.style.color = '#00f5d4';
                btn.style.borderColor = '#00f5d4';
                document.removeEventListener('click', startAudio);
             }).catch(e => { /* Ignore blocked autoplay */ });
         }
      };
      document.addEventListener('click', startAudio, { once: true });

      btn.addEventListener('click', (e) => {
         e.stopPropagation(); // prevent document click from overriding
         if (this.isAudioPlaying) {
             audio.pause();
             this.isAudioPlaying = false;
             btn.innerHTML = '🎵 Focus Off';
             btn.style.color = 'var(--text-secondary)';
             btn.style.borderColor = 'var(--border-default)';
         } else {
             audio.volume = 0.4;
             audio.play();
             this.isAudioPlaying = true;
             btn.innerHTML = '🎵 Focus On';
             btn.style.color = '#00f5d4';
             btn.style.borderColor = '#00f5d4';
         }
      });
    },

    _initHourlyQuote() {
      const quotes = [
        "You're one hour closer to Microsoft Certification. Keep grinding!",
        "Discipline equals freedom. Master MS Word, master your time.",
        "Your future self is watching you study right now. Make them proud.",
        "Shortcuts are the secret language of the elite. Memorize them.",
        "Every XP earned is a step toward your MOS credential."
      ];
      
      let lastHour = new Date().getHours();
      
      setInterval(() => {
         const currentHour = new Date().getHours();
         if (currentHour !== lastHour) {
            lastHour = currentHour;
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            Toast.info(`💡 Hourly Motivation: ${q}`, { duration: 15000 });
            Confetti.burst();
         }
      }, 60000); // Check every minute
    }
  };

  const AntiCheat = {
    init() {
      // Disable right-click
      document.addEventListener('contextmenu', e => e.preventDefault());
      
      // Disable copy/cut (except inside the Word Lab editor if allowed, but globally blocked for simplicity)
      document.addEventListener('copy', e => { 
        if(!e.target.isContentEditable) {
           e.preventDefault(); 
           Toast.warning('🛡️ Copying is disabled for security'); 
        }
      });
      document.addEventListener('cut', e => {
        if(!e.target.isContentEditable) e.preventDefault();
      });
      
      // Block Keybinds (Screenshot, Dev tools)
      const handleKey = e => {
        // PrintScreen, F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+C
        if (
          e.key === 'PrintScreen' ||
          e.code === 'PrintScreen' ||
          e.code === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.code === 'KeyI') ||
          (e.ctrlKey && e.code === 'KeyU') ||
          (e.ctrlKey && e.code === 'KeyS') ||
          (e.ctrlKey && e.code === 'KeyP') ||
          (e.ctrlKey && e.code === 'KeyC' && !e.target.isContentEditable) ||
          (e.metaKey && e.shiftKey && e.code === 'KeyS') // Windows Shift S / Mac snip
        ) {
          e.preventDefault();
          this._triggerBlackout(5000); // 5 seconds to permanently ruin screenshots
          try {
            navigator.clipboard.writeText(''); // Clear clipboard immediately
          } catch(err) {
             /* Ignore document out-of-focus error when snipping tool overrides */
          }
        }
      };

      document.addEventListener('keydown', handleKey);
      document.addEventListener('keyup', handleKey);

      // Detect snipping tool overlay (window blur out of focus)
      window.addEventListener('blur', () => this._triggerBlackout(5000));
    },

    _triggerBlackout(duration = 2000) {
      let overlay = document.getElementById('anticheat-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'anticheat-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#0f172a;z-index:9999999;color:var(--text-primary);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:24px;font-family:var(--font-primary);opacity:0;pointer-events:none;transition:opacity 0.05s ease;backdrop-filter:blur(20px);';
        overlay.innerHTML = '<div style="font-size:64px;margin-bottom:20px">🛡️</div><div style="font-weight:bold">Content Protected</div><div style="font-size:16px;color:var(--text-secondary);margin-top:10px">Screenshots and copying are disabled.</div>';
        document.body.appendChild(overlay);
      }
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'all';
      
      if (this._timeout) clearTimeout(this._timeout);
      this._timeout = setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }, duration);
    }
  };
  window.AdminKeygen = {
    generate() {
      const input = document.getElementById('admin-device-id')?.value.trim().toUpperCase();
      const output = document.getElementById('admin-unlock-code');
      if (!output) return;
      
      if (!input || input.length < 4) {
        output.textContent = '------';
        return;
      }

      let hash = 0;
      for (let i = 0; i < input.length; i++) {
          hash = (hash << 5) - hash + input.charCodeAt(i);
          hash |= 0;
      }
      let magic = Math.abs(hash * 31337 + 9991).toString(36).toUpperCase();
      output.textContent = magic.padStart(6, 'X').substring(0, 6);
    }
  };

  window.AutoRap = {
    audioCtx: null,
    isPlaying: false,
    intervalId: null,

    initAudio() {
       if(!this.audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.audioCtx = new AudioContext();
       }
       if(this.audioCtx.state === 'suspended') this.audioCtx.resume();
    },

    playKick(time) {
       if(!this.audioCtx) return;
       const osc = this.audioCtx.createOscillator();
       const gain = this.audioCtx.createGain();
       osc.connect(gain);
       gain.connect(this.audioCtx.destination);
       
       osc.frequency.setValueAtTime(150, time);
       osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
       gain.gain.setValueAtTime(1, time);
       gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
       
       osc.start(time);
       osc.stop(time + 0.5);
    },

    playSnare(time) {
       if(!this.audioCtx) return;
       const osc = this.audioCtx.createOscillator();
       const gain = this.audioCtx.createGain();
       osc.type = 'triangle';
       osc.connect(gain);
       gain.connect(this.audioCtx.destination);
       
       osc.frequency.setValueAtTime(250, time);
       gain.gain.setValueAtTime(0.5, time);
       gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
       
       osc.start(time);
       osc.stop(time + 0.2);
    },

    startBeat(bpm = 95) {
       this.initAudio();
       if(this.isPlaying) return;
       this.isPlaying = true;
       
       const stepTime = (60 / bpm) * 0.5; // Eighth note
       let nextTime = this.audioCtx.currentTime + 0.1;
       let step = 0;

       const schedule = () => {
          while (nextTime < this.audioCtx.currentTime + 0.1 && this.isPlaying) {
             if (step % 4 === 0) this.playKick(nextTime); // 1, 3
             if (step % 4 === 2) this.playSnare(nextTime); // 2, 4
             
             // High hat
             const osc = this.audioCtx.createOscillator();
             const gain = this.audioCtx.createGain();
             osc.type = 'square';
             osc.frequency.value = 8000;
             osc.connect(gain); gain.connect(this.audioCtx.destination);
             gain.gain.setValueAtTime(0.05, nextTime);
             gain.gain.exponentialRampToValueAtTime(0.001, nextTime + 0.05);
             osc.start(nextTime); osc.stop(nextTime + 0.05);

             nextTime += stepTime;
             step++;
          }
          if(this.isPlaying) this.intervalId = requestAnimationFrame(schedule);
       };
       schedule();
    },

    stopBeat() {
       this.isPlaying = false;
       if(this.intervalId) cancelAnimationFrame(this.intervalId);
    },

    spit(elementId) {
       const text = document.getElementById(elementId)?.innerText || '';
       if(!text) return;
       
       const statusEl = document.getElementById('studio-status');
       if(statusEl) statusEl.textContent = 'RAP_ENGINE // SPITTING_FIRE...';

       window.speechSynthesis.cancel();
       this.stopBeat();
       Toast.info("🎙️ Dropping the beat...");
       this.startBeat(95);

       const utterance = new SpeechSynthesisUtterance(text);
       
       // ArrDee Style: Fast, bouncy UK male voice
       const voices = window.speechSynthesis.getVoices();
       const arrDeeVoice = voices.find(v => v.lang === 'en-GB' && v.name.toLowerCase().includes('male')) || 
                           voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) ||
                           voices.find(v => v.lang === 'en-GB');
                           
       if (arrDeeVoice) {
          utterance.voice = arrDeeVoice;
          // If forced to use female, pitch it down to simulate male
          if (arrDeeVoice.name.toLowerCase().includes('female') || arrDeeVoice.name.toLowerCase().includes('zira')) {
              utterance.pitch = 0.6;
          } else {
              utterance.pitch = 1.1;
          }
       } else {
          utterance.pitch = 0.8;
       }
       
       utterance.rate = 1.55; // ArrDee fast flow
       
       utterance.onend = () => {
          setTimeout(() => {
             this.stopBeat();
             if(statusEl) statusEl.textContent = 'RAP_ENGINE // IDLE';
          }, 1000);
       };

       window.speechSynthesis.speak(utterance);
    },

    playAll() {
       const tracks = ['track1-lyrics', 'track2-lyrics', 'track3-lyrics', 'track4-lyrics', 'track5-lyrics', 'track6-lyrics', 'track7-lyrics', 'track8-lyrics'];
       let fullLyrics = "";
       tracks.forEach(id => {
          const el = document.getElementById(id);
          if (el) fullLyrics += " Yeah. Next track. " + el.innerText;
       });
       
       const statusEl = document.getElementById('studio-status');
       if(statusEl) statusEl.textContent = 'RAP_ENGINE // PERFORMING_ALBUM...';

       window.speechSynthesis.cancel();
       this.stopBeat();
       
       Toast.info("🎙️ Performing the entire album!");
       this.startBeat(98);
       
       const utterance = new SpeechSynthesisUtterance(fullLyrics);

       // ArrDee Style
       const voices = window.speechSynthesis.getVoices();
       const arrDeeVoice = voices.find(v => v.lang === 'en-GB' && v.name.toLowerCase().includes('male')) || 
                           voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) ||
                           voices.find(v => v.lang === 'en-GB');
                           
       if (arrDeeVoice) {
          utterance.voice = arrDeeVoice;
          if (arrDeeVoice.name.toLowerCase().includes('female') || arrDeeVoice.name.toLowerCase().includes('zira')) {
              utterance.pitch = 0.6;
          } else {
              utterance.pitch = 1.1;
          }
       } else {
          utterance.pitch = 0.8;
       }

       utterance.rate = 1.55;
       utterance.onend = () => {
          setTimeout(() => {
             this.stopBeat();
             if(statusEl) statusEl.textContent = 'RAP_ENGINE // IDLE';
          }, 1000);
       };
       
       window.speechSynthesis.speak(utterance);
    }
  };

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
