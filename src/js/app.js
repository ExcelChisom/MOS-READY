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

    if (window.Router && window.RelaxGames) {
      Router.onPageEnter('relax', () => {
        RelaxGames.showMenu();
      });
    }

    AntiCheat.init();
    BackgroundWorkers.init();

    // Show onboarding tutorial on first visit
    if (!localStorage.getItem('mos_onboarded')) {
      setTimeout(() => Onboarding.start(), 1500);
    }

    console.log('🎯 MOS-READY initialized');
  }

  // ==========================================
  // ONBOARDING TUTORIAL
  // ==========================================
  const Onboarding = {
    steps: [
      { title: 'Welcome to MOS-READY! 🎯', text: 'This app will help you master Microsoft Word and pass the MOS exam with confidence. Let me show you around!', icon: '🚀' },
      { title: 'Dashboard 📊', text: 'Your home base! See your XP, streak, progress, and recent activity. The MOS Journey mindmap shows your path from Novice to Virtuoso.', icon: '📊', page: 'dashboard' },
      { title: 'Learn 📚', text: 'Step-by-step lessons covering all MOS Word exam objectives. Complete modules to earn XP and build knowledge.', icon: '📚', page: 'learn' },
      { title: 'Quizzes & Mock Exams 📝', text: 'Test your knowledge with quizzes by topic, or take a full timed Mock Exam that simulates the real test!', icon: '📝', page: 'quizzes' },
      { title: 'Games 🎮', text: 'Learn through play! Match cards, speed quizzes, WHOT card battles, and premium brain-hacking games.', icon: '🎮', page: 'games' },
      { title: 'Word Lab ✏️', text: 'Practice MS Word tasks in a built-in editor or with real Word. 48 hands-on tasks covering every exam area.', icon: '✏️', page: 'word-lab' },
      { title: 'My Resources 📁', text: 'Upload study notes (PDF, DOCX, TXT, PPT), generate quizzes, create mindmaps, manage to-do lists, and get concept breakdowns.', icon: '📁', page: 'resources' },
      { title: 'Floating Tools 🧰', text: 'The buttons on the right give you quick access to the Scientific Calculator, Study Timer, and External Playlist player.', icon: '🧰' },
      { title: 'You\'re Ready! 💪', text: 'Start with the Guide section on your Dashboard to find your weak spots, or jump straight into Learning. Good luck!', icon: '🏆' }
    ],
    currentStep: 0,

    start() {
      this.currentStep = 0;
      this._render();
    },

    _render() {
      const step = this.steps[this.currentStep];
      const isLast = this.currentStep === this.steps.length - 1;
      const isFirst = this.currentStep === 0;

      let overlay = document.getElementById('onboarding-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'onboarding-overlay';
        document.body.appendChild(overlay);
      }

      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)';
      overlay.innerHTML = `
        <div style="background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(29,53,87,0.95));border:1px solid rgba(124,92,252,0.3);border-radius:20px;padding:40px;max-width:520px;width:90%;text-align:center;box-shadow:0 30px 60px rgba(0,0,0,0.5);animation:scaleIn 0.3s ease">
          <div style="font-size:64px;margin-bottom:16px">${step.icon}</div>
          <h2 style="font-size:22px;font-weight:800;margin-bottom:12px;color:white">${step.title}</h2>
          <p style="font-size:15px;line-height:1.7;color:rgba(255,255,255,0.75);margin-bottom:24px">${step.text}</p>
          <div style="display:flex;justify-content:center;gap:8px;margin-bottom:16px">
            ${this.steps.map((_, i) => '<div style="width:8px;height:8px;border-radius:50%;background:' + (i === this.currentStep ? '#7c5cfc' : 'rgba(255,255,255,0.2)') + ';transition:background 0.3s"></div>').join('')}
          </div>
          <div style="display:flex;gap:12px;justify-content:center">
            ${!isFirst ? '<button onclick="Onboarding.prev()" style="padding:10px 24px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:white;cursor:pointer;font-size:14px">← Back</button>' : ''}
            <button onclick="Onboarding.skip()" style="padding:10px 24px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(255,255,255,0.5);cursor:pointer;font-size:13px">Skip Tutorial</button>
            <button onclick="Onboarding.${isLast ? 'finish' : 'next'}()" style="padding:10px 30px;border-radius:10px;border:none;background:linear-gradient(135deg,#7c5cfc,#00f5d4);color:white;cursor:pointer;font-size:14px;font-weight:700">${isLast ? 'Get Started! 🚀' : 'Next →'}</button>
          </div>
        </div>
      `;
    },

    next() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        const step = this.steps[this.currentStep];
        if (step.page && window.Router) Router.navigate(step.page);
        this._render();
      }
    },

    prev() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this._render();
      }
    },

    skip() { this.finish(); },

    finish() {
      localStorage.setItem('mos_onboarded', 'true');
      const overlay = document.getElementById('onboarding-overlay');
      if (overlay) overlay.remove();
      if (window.Router) Router.navigate('dashboard');
    }
  };
  window.Onboarding = Onboarding;

  // ==========================================
  // GUIDE / ASSESSMENT SYSTEM
  // ==========================================
  const GuideAssessment = {
    questions: [
      { q: 'How comfortable are you creating and saving Word documents?', area: 'Document Management', options: ['Very comfortable', 'Somewhat', 'Not sure', 'Never tried'] },
      { q: 'Can you apply text formatting (Bold, Italic, fonts, colors)?', area: 'Text Formatting', options: ['Easily', 'With some effort', 'I struggle', 'What is that?'] },
      { q: 'Do you know how to insert and format Tables?', area: 'Tables', options: ['Yes, including styles', 'Basic tables only', 'Not really', 'Never done it'] },
      { q: 'Can you set up Headers, Footers, and Page Numbers?', area: 'Headers & Footers', options: ['Definitely', 'I think so', 'Not confident', 'No idea'] },
      { q: 'How well do you know Page Layout (margins, orientation, columns)?', area: 'Page Layout', options: ['Expert level', 'I know basics', 'A little', 'Not at all'] },
      { q: 'Can you insert and manage images, shapes, and text boxes?', area: 'Graphics & Objects', options: ['Easily', 'Somewhat', 'Barely', 'Never'] },
      { q: 'Do you know how to use Styles and create a Table of Contents?', area: 'References & Styles', options: ['Yes!', 'Partially', 'Heard of it', 'No clue'] },
      { q: 'How familiar are you with Mail Merge?', area: 'Mail Merge', options: ['Done it before', 'Know the concept', 'Very vague', 'Never heard of it'] },
      { q: 'Can you use Track Changes and Comments for collaboration?', area: 'Review & Collaboration', options: ['Pro at it', 'Used it once', 'Not really', 'What?'] },
      { q: 'How often do you use keyboard shortcuts in Word?', area: 'Efficiency & Shortcuts', options: ['All the time', 'A few', 'Rarely', 'Never'] }
    ],
    answers: [],
    current: 0,

    start() {
      this.answers = [];
      this.current = 0;
      this._render();
    },

    _render() {
      const container = document.getElementById('guide-assessment-area');
      if (!container) return;

      if (this.current >= this.questions.length) {
        this._showResults(container);
        return;
      }

      const q = this.questions[this.current];
      container.innerHTML = `
        <div class="glass-card" style="max-width:600px;margin:0 auto;padding:30px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
            <span style="font-size:12px;opacity:0.5">Question ${this.current + 1} of ${this.questions.length}</span>
            <span class="badge badge-primary">${q.area}</span>
          </div>
          <h4 style="font-size:17px;font-weight:700;margin-bottom:20px;line-height:1.6">${q.q}</h4>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${q.options.map((opt, i) => `
              <div onclick="GuideAssessment.answer(${i})" style="padding:14px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:14px" onmouseover="this.style.borderColor='#7c5cfc';this.style.background='rgba(124,92,252,0.1)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.background='rgba(255,255,255,0.04)'">${opt}</div>
            `).join('')}
          </div>
          <div style="margin-top:16px;background:rgba(255,255,255,0.05);border-radius:8px;height:6px;overflow:hidden">
            <div style="height:100%;background:linear-gradient(90deg,#7c5cfc,#00f5d4);width:${((this.current) / this.questions.length) * 100}%;transition:width 0.3s;border-radius:8px"></div>
          </div>
        </div>
      `;
    },

    answer(idx) {
      this.answers.push({ area: this.questions[this.current].area, score: 3 - idx }); // 3=best, 0=worst
      this.current++;
      this._render();
    },

    _showResults(container) {
      const weakAreas = this.answers.filter(a => a.score <= 1).map(a => a.area);
      const strongAreas = this.answers.filter(a => a.score >= 2).map(a => a.area);
      const overall = this.answers.reduce((sum, a) => sum + a.score, 0);
      const maxScore = this.questions.length * 3;
      const pct = Math.round((overall / maxScore) * 100);

      let level, emoji, color;
      if (pct >= 80) { level = 'Advanced'; emoji = '🏆'; color = '#00f5d4'; }
      else if (pct >= 50) { level = 'Intermediate'; emoji = '📈'; color = '#fee440'; }
      else { level = 'Beginner'; emoji = '🌱'; color = '#f72585'; }

      localStorage.setItem('mos_guide_results', JSON.stringify({ weakAreas, strongAreas, pct, level }));

      container.innerHTML = `
        <div class="glass-card" style="max-width:600px;margin:0 auto;padding:30px;text-align:center">
          <div style="font-size:64px;margin-bottom:12px">${emoji}</div>
          <h3 style="font-size:22px;font-weight:800;margin-bottom:8px">Your Level: <span style="color:${color}">${level}</span></h3>
          <p style="font-size:14px;opacity:0.6;margin-bottom:20px">Overall score: ${pct}%</p>
          ${weakAreas.length > 0 ? `
            <div style="text-align:left;margin-bottom:20px">
              <h4 style="color:#f72585;font-size:14px;margin-bottom:10px">⚠️ Areas to Improve:</h4>
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                ${weakAreas.map(a => '<span style="background:rgba(247,37,133,0.15);border:1px solid rgba(247,37,133,0.3);padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600">' + a + '</span>').join('')}
              </div>
            </div>
          ` : ''}
          ${strongAreas.length > 0 ? `
            <div style="text-align:left;margin-bottom:20px">
              <h4 style="color:#00f5d4;font-size:14px;margin-bottom:10px">💪 Your Strengths:</h4>
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                ${strongAreas.map(a => '<span style="background:rgba(0,245,212,0.1);border:1px solid rgba(0,245,212,0.3);padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600">' + a + '</span>').join('')}
              </div>
            </div>
          ` : ''}
          <div style="display:flex;gap:10px;justify-content:center;margin-top:20px">
            <button class="btn btn-primary" onclick="Router.navigate('learn')">📚 Start Learning</button>
            <button class="btn btn-secondary" onclick="GuideAssessment.start()">🔄 Retake</button>
          </div>
        </div>
      `;

      if (window.XP) XP.award(15, 'Completed Guide Assessment');
    }
  };
  window.GuideAssessment = GuideAssessment;

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
