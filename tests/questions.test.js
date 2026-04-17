/**
 * MOS-READY Tests — Question Bank Integrity
 */

// The questions file sets globals on `window` and `module`
// We need to capture via the IIFE pattern
const fs = require('fs');
const src = fs.readFileSync('./src/js/data/questions.js', 'utf8');

// Extract the data by running the file in a controlled scope
let QUESTION_BANK, MOCK_EXAM_QUESTIONS, PRACTICE_EXAM_QUESTIONS;

// The file defines top-level const variables and then sets window/module exports
// We need to evaluate it so the const declarations are accessible
const fn = new Function('window', 'module', src + '\nreturn { QUESTION_BANK, MOCK_EXAM_QUESTIONS, PRACTICE_EXAM_QUESTIONS };');
const result = fn({}, { exports: {} });
QUESTION_BANK = result.QUESTION_BANK;
MOCK_EXAM_QUESTIONS = result.MOCK_EXAM_QUESTIONS;
PRACTICE_EXAM_QUESTIONS = result.PRACTICE_EXAM_QUESTIONS;

describe('Question Bank Integrity', () => {
  const allModuleQuestions = Object.values(QUESTION_BANK).flat();

  test('all modules have questions', () => {
    const modules = Object.keys(QUESTION_BANK);
    expect(modules.length).toBeGreaterThanOrEqual(6);
    modules.forEach(mod => {
      expect(QUESTION_BANK[mod].length).toBeGreaterThan(0);
    });
  });

  test('each question has required fields', () => {
    allModuleQuestions.forEach(q => {
      expect(q.id).toBeDefined();
      expect(q.question).toBeDefined();
      expect(q.options).toBeDefined();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(typeof q.correct).toBe('number');
      expect(q.correct).toBeLessThan(q.options.length);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.explanation).toBeDefined();
    });
  });

  test('all question IDs are unique', () => {
    const ids = allModuleQuestions.map(q => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('each question has a hint', () => {
    allModuleQuestions.forEach(q => {
      expect(q.hint).toBeDefined();
      expect(q.hint.length).toBeGreaterThan(0);
    });
  });

  test('correct answer index is valid for each question', () => {
    allModuleQuestions.forEach(q => {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
    });
  });
});

describe('Mock Exam Questions', () => {
  test('has at least 20 questions', () => {
    expect(MOCK_EXAM_QUESTIONS.length).toBeGreaterThanOrEqual(20);
  });

  test('all mock questions have required fields', () => {
    MOCK_EXAM_QUESTIONS.forEach(q => {
      expect(q.id).toBeDefined();
      expect(q.question).toBeDefined();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(typeof q.correct).toBe('number');
      expect(q.explanation).toBeDefined();
      expect(q.hint).toBeDefined();
    });
  });

  test('mock question IDs are unique', () => {
    const ids = MOCK_EXAM_QUESTIONS.map(q => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('most mock questions have scenarios', () => {
    const withScenarios = MOCK_EXAM_QUESTIONS.filter(q => q.scenario);
    expect(withScenarios.length).toBeGreaterThan(MOCK_EXAM_QUESTIONS.length * 0.5);
  });
});

describe('Practice Exam Questions', () => {
  test('has at least 40 questions', () => {
    expect(PRACTICE_EXAM_QUESTIONS.length).toBeGreaterThanOrEqual(40);
  });

  test('all practice questions have valid structure', () => {
    PRACTICE_EXAM_QUESTIONS.forEach(q => {
      expect(q.id).toBeDefined();
      expect(q.question).toBeDefined();
      expect(q.options).toBeDefined();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(typeof q.correct).toBe('number');
      expect(q.correct).toBeLessThan(q.options.length);
    });
  });
});
