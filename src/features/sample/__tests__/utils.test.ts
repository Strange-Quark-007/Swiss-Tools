import { describe, it, expect } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { bulkConvertSample, convertSample, SAMPLE } from '../utils';

describe('sample utils', () => {
  describe('convertSample', () => {
    it('should return empty result for empty or whitespace string', () => {
      expect(convertSample('', SAMPLE.sample.value, SAMPLE.sample.value, testT)).toEqual({
        result: '',
      });
      expect(convertSample('   ', SAMPLE.sample.value, SAMPLE.sample.value, testT)).toEqual({
        result: '',
      });
    });

    it('should return empty result for non-empty text input', () => {
      expect(convertSample('hello', SAMPLE.sample.value, SAMPLE.sample.value, testT)).toEqual({
        result: '',
      });
    });
  });

  describe('bulkConvertSample', () => {
    it('should return empty result for empty or whitespace string', () => {
      expect(bulkConvertSample('', SAMPLE.sample.value, SAMPLE.sample.value, testT)).toEqual({
        result: '',
      });
      expect(bulkConvertSample('   \n  \t  ', SAMPLE.sample.value, SAMPLE.sample.value, testT)).toEqual({
        result: '',
      });
    });

    it('should return empty result for non-empty text input in sample template', () => {
      expect(bulkConvertSample('hello', SAMPLE.sample.value, SAMPLE.sample.value, testT)).toEqual({
        result: '',
      });
    });
  });
});

