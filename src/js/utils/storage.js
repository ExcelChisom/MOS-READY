/**
 * MOS-READY — localStorage-based persistence
 */
const Storage = {
  _prefix: 'mosready_',

  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this._prefix + key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this._prefix + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  },

  remove(key) {
    localStorage.removeItem(this._prefix + key);
  },

  // Convenience methods for common data
  getXP() { return this.get('xp', 0); },
  setXP(val) { this.set('xp', val); },

  getLevel() { return this.get('level', 1); },
  setLevel(val) { this.set('level', val); },

  getStreak() { return this.get('streak', 0); },
  setStreak(val) { this.set('streak', val); },

  getLastActive() { return this.get('lastActive', null); },
  setLastActive(val) { this.set('lastActive', val); },

  getQuizzesCompleted() { return this.get('quizzesCompleted', 0); },
  setQuizzesCompleted(val) { this.set('quizzesCompleted', val); },

  getModuleProgress() { return this.get('moduleProgress', {}); },
  setModuleProgress(val) { this.set('moduleProgress', val); },

  getActivity() { return this.get('activity', []); },
  addActivity(item) {
    const activities = this.getActivity();
    activities.unshift({ ...item, time: Date.now() });
    if (activities.length > 20) activities.length = 20;
    this.set('activity', activities);
  },

  // Mock exam history
  getMockHistory() { return this.get('mockHistory', []); },
  addMockSession(session) {
    const history = this.getMockHistory();
    history.unshift(session);
    this.set('mockHistory', history);
  },

  // Used question IDs per session to prevent repeats
  getUsedMockQuestions() { return this.get('usedMockQuestions', []); },
  setUsedMockQuestions(val) { this.set('usedMockQuestions', val); },
  resetUsedMockQuestions() { this.set('usedMockQuestions', []); },

  // Practice exam
  getPracticeAttempts() { return this.get('practiceAttempts', 0); },
  setPracticeAttempts(val) { this.set('practiceAttempts', val); },
  getPracticePaid() { return this.get('practicePaid', false); },
  setPracticePaid(val) { this.set('practicePaid', val); },

  // Resources
  getResources() { return this.get('resources', []); },
  setResources(val) { this.set('resources', val); },
  addResource(resource) {
    const resources = this.getResources();
    resources.unshift(resource);
    this.set('resources', resources);
  },

  // Game scores
  getGameScores() { return this.get('gameScores', {}); },
  setGameScore(gameId, score) {
    const scores = this.getGameScores();
    if (!scores[gameId]) scores[gameId] = [];
    scores[gameId].push({ score, time: Date.now() });
    this.set('gameScores', scores);
  }
};

window.Storage = Storage;
