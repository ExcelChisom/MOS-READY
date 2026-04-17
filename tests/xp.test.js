/**
 * MOS-READY Tests — XP System
 */

// Since the XP module uses browser APIs (localStorage, DOM), we simulate them
const mockStorage = {};
const mockLocalStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = val; },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => Object.keys(mockStorage).forEach(k => delete mockStorage[k])
};

// Setup globals
global.localStorage = mockLocalStorage;
global.document = {
  getElementById: () => null,
  querySelectorAll: () => []
};
global.window = { Storage: null, XP: null, Toast: null, Confetti: null };
global.Date.now = () => 1713388800000; // Fixed timestamp

// Mock Toast and Confetti
global.Toast = { xp: () => {}, success: () => {}, init: () => {} };
global.Confetti = { burst: () => {}, init: () => {} };

// Load Storage
eval(require('fs').readFileSync('./src/js/utils/storage.js', 'utf8'));
const Storage = global.window.Storage || global.Storage;

// Load XP
eval(require('fs').readFileSync('./src/js/utils/xp.js', 'utf8'));
const XP = global.window.XP || global.XP;

// Tests
describe('Storage', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('get/set basic values', () => {
    Storage.set('test', 42);
    expect(Storage.get('test')).toBe(42);
  });

  test('returns default for missing keys', () => {
    expect(Storage.get('nonexistent', 'default')).toBe('default');
  });

  test('XP convenience methods work', () => {
    Storage.setXP(100);
    expect(Storage.getXP()).toBe(100);
  });

  test('level convenience methods work', () => {
    Storage.setLevel(5);
    expect(Storage.getLevel()).toBe(5);
  });

  test('streak convenience methods work', () => {
    Storage.setStreak(3);
    expect(Storage.getStreak()).toBe(3);
  });

  test('activity tracking', () => {
    Storage.addActivity({ type: 'test', text: 'Test activity' });
    const activities = Storage.getActivity();
    expect(activities.length).toBe(1);
    expect(activities[0].text).toBe('Test activity');
    expect(activities[0].time).toBeDefined();
  });

  test('activity capped at 20 items', () => {
    for (let i = 0; i < 25; i++) {
      Storage.addActivity({ type: 'test', text: `Activity ${i}` });
    }
    expect(Storage.getActivity().length).toBe(20);
  });

  test('mock history', () => {
    Storage.addMockSession({ id: 1, score: 15, total: 20, answers: [] });
    const history = Storage.getMockHistory();
    expect(history.length).toBe(1);
    expect(history[0].score).toBe(15);
  });

  test('used mock questions tracking', () => {
    Storage.setUsedMockQuestions(['q1', 'q2']);
    expect(Storage.getUsedMockQuestions()).toEqual(['q1', 'q2']);
    Storage.resetUsedMockQuestions();
    expect(Storage.getUsedMockQuestions()).toEqual([]);
  });

  test('practice exam attempts', () => {
    Storage.setPracticeAttempts(1);
    expect(Storage.getPracticeAttempts()).toBe(1);
    Storage.setPracticePaid(true);
    expect(Storage.getPracticePaid()).toBe(true);
  });

  test('resources CRUD', () => {
    Storage.addResource({ id: 1, title: 'Test', questions: [] });
    expect(Storage.getResources().length).toBe(1);
    Storage.setResources([]);
    expect(Storage.getResources().length).toBe(0);
  });

  test('game scores', () => {
    Storage.setGameScore('match', { moves: 10 });
    const scores = Storage.getGameScores();
    expect(scores.match).toBeDefined();
    expect(scores.match.length).toBe(1);
  });
});

describe('XP System', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('xpForLevel returns increasing values', () => {
    const l1 = XP.xpForLevel(1);
    const l2 = XP.xpForLevel(2);
    const l5 = XP.xpForLevel(5);
    expect(l1).toBe(100);
    expect(l2).toBeGreaterThan(l1);
    expect(l5).toBeGreaterThan(l2);
  });

  test('getLevelName returns correct names', () => {
    expect(XP.getLevelName(1)).toBe('Rookie');
    expect(XP.getLevelName(5)).toBe('Intermediate');
    expect(XP.getLevelName(10)).toBe('Master');
  });

  test('award adds XP correctly', () => {
    const result = XP.award(50, 'test');
    expect(result.xpGained).toBe(50);
    expect(result.newXP).toBe(50);
    expect(Storage.getXP()).toBe(50);
  });

  test('award multiple times accumulates XP', () => {
    XP.award(30, 'first');
    XP.award(40, 'second');
    expect(Storage.getXP()).toBe(70);
  });

  test('level up triggers on sufficient XP', () => {
    // Level 1 requires 100 XP
    const result = XP.award(150, 'big award');
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBeGreaterThan(1);
  });

  test('getLevelInfo returns correct structure', () => {
    Storage.setXP(50);
    Storage.setLevel(1);
    const info = XP.getLevelInfo();
    expect(info.level).toBe(1);
    expect(info.levelName).toBe('Rookie');
    expect(info.xp).toBe(50);
    expect(info.xpForLevel).toBe(100);
    expect(info.progress).toBeCloseTo(0.5);
  });
});
