/**
 * MOS-READY Tests — Learning Modules Integrity
 */

// Setup globals before loading module
global.window = {};
global.module = { exports: {} };

eval(require('fs').readFileSync('./src/js/data/modules.js', 'utf8'));
const LEARNING_MODULES = global.module.exports.LEARNING_MODULES || global.window.LEARNING_MODULES || [];

describe('Learning Modules', () => {
  test('has at least 5 modules', () => {
    expect(LEARNING_MODULES.length).toBeGreaterThanOrEqual(10);
  });

  test('each module has required fields', () => {
    LEARNING_MODULES.forEach(mod => {
      expect(mod.id).toBeDefined();
      expect(mod.title).toBeDefined();
      expect(mod.emoji).toBeDefined();
      expect(mod.description).toBeDefined();
      expect(mod.gradient).toBeDefined();
      expect(mod.xpReward).toBeGreaterThan(0);
      expect(mod.steps).toBeDefined();
      expect(mod.steps.length).toBeGreaterThan(0);
    });
  });

  test('module IDs are unique', () => {
    const ids = LEARNING_MODULES.map(m => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('each step has title and content', () => {
    LEARNING_MODULES.forEach(mod => {
      mod.steps.forEach(step => {
        expect(step.title).toBeDefined();
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.content).toBeDefined();
        expect(step.content.length).toBeGreaterThan(0);
      });
    });
  });

  test('total steps across all modules', () => {
    const totalSteps = LEARNING_MODULES.reduce((sum, mod) => sum + mod.steps.length, 0);
    expect(totalSteps).toBeGreaterThan(25);
  });

  test('modules cover key MOS Word exam areas', () => {
    const titles = LEARNING_MODULES.map(m => m.title.toLowerCase());
    expect(titles.some(t => t.includes('document') || t.includes('management'))).toBe(true);
    expect(titles.some(t => t.includes('format') || t.includes('text'))).toBe(true);
    expect(titles.some(t => t.includes('table') || t.includes('list'))).toBe(true);
  });
});
