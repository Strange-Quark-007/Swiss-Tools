import { describe, it, expect } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { LOREM, MAX_COUNT, generateLorem, lorem, LoremType } from '../utils';

describe('lorem-generator utils', () => {
  describe('constants', () => {
    it('should define LOREM types correctly', () => {
      expect(LOREM.word.value).toBe('word');
      expect(LOREM.word.label).toBe('Words');
      expect(LOREM.sentence.value).toBe('sentence');
      expect(LOREM.sentence.label).toBe('Sentences');
      expect(LOREM.paragraph.value).toBe('paragraph');
      expect(LOREM.paragraph.label).toBe('Paragraphs');
    });

    it('should define MAX_COUNT as 1000', () => {
      expect(MAX_COUNT).toBe(1000);
    });

    it('should expose a configured lorem-ipsum instance', () => {
      expect(lorem).toBeDefined();
      expect(typeof lorem.generateWords).toBe('function');
    });
  });

  describe('generateLorem', () => {
    it('should return error when count is zero or not finite', () => {
      expect(generateLorem(LOREM.word.value, 0, testT)).toEqual({
        result: '',
        error: testT('loremGenerator.invalidCount'),
      });

      expect(generateLorem(LOREM.word.value, NaN, testT)).toEqual({
        result: '',
        error: testT('loremGenerator.invalidCount'),
      });

      expect(generateLorem(LOREM.word.value, Infinity, testT)).toEqual({
        result: '',
        error: testT('loremGenerator.invalidCount'),
      });
    });

    it('should generate requested number of words', () => {
      const res = generateLorem(LOREM.word.value, 5, testT);
      expect(res.error).toBeUndefined();
      expect(res.result).toBeTruthy();
      const words = res.result.trim().split(/\s+/);
      expect(words).toHaveLength(5);
    });

    it('should generate requested number of sentences', () => {
      const res = generateLorem(LOREM.sentence.value, 3, testT);
      expect(res.error).toBeUndefined();
      expect(res.result).toBeTruthy();
      // lorem-ipsum separates sentences with a space or period
      expect(res.result.endsWith('.')).toBe(true);
    });

    it('should generate requested number of paragraphs joined by double newlines', () => {
      const res = generateLorem(LOREM.paragraph.value, 3, testT);
      expect(res.error).toBeUndefined();
      expect(res.result).toBeTruthy();
      const paragraphs = res.result.split('\n\n');
      expect(paragraphs).toHaveLength(3);
    });

    it('should throw an error on unsupported type (exhaustiveCheck)', () => {
      expect(() => generateLorem('unknown-type' as LoremType, 5, testT)).toThrowError(
        'Unexpected case: unknown-type'
      );
    });
  });
});
