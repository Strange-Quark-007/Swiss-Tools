import { describe, it, expect, vi } from 'vitest';

import { bulkProcessor } from '../bulk-processor';

describe('bulkProcessor', () => {
  const dummySuccessProcessor = (item: string) => ({
    result: item.toUpperCase(),
  });

  describe('empty and whitespace inputs', () => {
    it('should return empty result when fromText is empty', () => {
      const result = bulkProcessor({
        fromText: '',
        processor: dummySuccessProcessor,
        converterArgs: [],
      });

      expect(result).toEqual({ result: '' });
    });

    it('should return empty result when fromText is only whitespace', () => {
      const result = bulkProcessor({
        fromText: '   \n\t  ',
        processor: dummySuccessProcessor,
        converterArgs: [],
      });

      expect(result).toEqual({ result: '' });
    });

    it('should return empty result when fromText only contains delimiter characters', () => {
      const result = bulkProcessor({
        fromText: ',, ,\n,\n',
        processor: dummySuccessProcessor,
        converterArgs: [],
      });

      expect(result).toEqual({ result: '' });
    });
  });

  describe('single and multiple items processing', () => {
    it('should process a single item correctly', () => {
      const result = bulkProcessor({
        fromText: 'hello',
        processor: dummySuccessProcessor,
        converterArgs: [],
      });

      expect(result).toEqual({
        result: 'HELLO',
        error: undefined,
      });
    });

    it('should split items using default delimiter regex (comma and newline)', () => {
      const result = bulkProcessor({
        fromText: 'hello, world\nfoo\nbar,baz',
        processor: dummySuccessProcessor,
        converterArgs: [],
      });

      expect(result).toEqual({
        result: 'HELLO\nWORLD\nFOO\nBAR\nBAZ',
        error: undefined,
      });
    });

    it('should trim surrounding whitespace from each item and filter out empty items', () => {
      const result = bulkProcessor({
        fromText: '   apple   , \n  banana  ,   \n  cherry  ',
        processor: dummySuccessProcessor,
        converterArgs: [],
      });

      expect(result).toEqual({
        result: 'APPLE\nBANANA\nCHERRY',
        error: undefined,
      });
    });

    it('should support a custom delimiter regex', () => {
      const result = bulkProcessor({
        fromText: 'hello, world; foo, bar',
        processor: dummySuccessProcessor,
        converterArgs: [],
        delimiterRegex: /;/,
      });

      expect(result).toEqual({
        result: 'HELLO, WORLD\nFOO, BAR',
        error: undefined,
      });
    });
  });

  describe('argument forwarding', () => {
    it('should pass item and all converterArgs to the processor in the correct order', () => {
      const mockProcessor = vi.fn((item: string, prefix: string, suffix: string, times: number) => ({
        result: `${prefix}-${item.repeat(times)}-${suffix}`,
      }));

      const result = bulkProcessor({
        fromText: 'a\nb',
        processor: mockProcessor,
        converterArgs: ['PRE', 'SUF', 2],
        delimiterRegex: /[\n]/,
      });

      expect(mockProcessor).toHaveBeenCalledTimes(2);
      expect(mockProcessor).toHaveBeenNthCalledWith(1, 'a', 'PRE', 'SUF', 2);
      expect(mockProcessor).toHaveBeenNthCalledWith(2, 'b', 'PRE', 'SUF', 2);

      expect(result).toEqual({
        result: 'PRE-aa-SUF\nPRE-bb-SUF',
        error: undefined,
      });
    });
  });

  describe('error handling and aggregation', () => {
    it('should aggregate errors and set bulkErrorTranslation when an item fails', () => {
      const processorWithError = (item: string) => {
        if (item === 'invalid') {
          return { result: '', error: 'Invalid item error' };
        }
        return { result: `valid:${item}` };
      };

      const result = bulkProcessor({
        fromText: 'first\ninvalid\nthird',
        processor: processorWithError,
        converterArgs: [],
        bulkErrorTranslation: 'Some conversions failed',
        delimiterRegex: /[\n]/,
      });

      expect(result).toEqual({
        result: 'valid:first\nInvalid item error\nvalid:third',
        error: 'Some conversions failed',
      });
    });

    it('should default bulkErrorTranslation to empty string when not provided and an error occurs', () => {
      const processorWithError = (item: string) => {
        if (item === 'bad') {
          return { result: '', error: 'Bad token' };
        }
        return { result: `good:${item}` };
      };

      const result = bulkProcessor({
        fromText: 'good\nbad',
        processor: processorWithError,
        converterArgs: [],
        delimiterRegex: /[\n]/,
      });

      expect(result).toEqual({
        result: 'good:good\nBad token',
        error: '',
      });
    });

    it('should leave error undefined when all items succeed even if bulkErrorTranslation is provided', () => {
      const result = bulkProcessor({
        fromText: 'item1\nitem2',
        processor: dummySuccessProcessor,
        converterArgs: [],
        bulkErrorTranslation: 'Failed to convert',
        delimiterRegex: /[\n]/,
      });

      expect(result).toEqual({
        result: 'ITEM1\nITEM2',
        error: undefined,
      });
    });

    it('should include all item error messages in result when every item fails', () => {
      const alwaysFails = (item: string) => ({
        result: '',
        error: `Failed on ${item}`,
      });

      const result = bulkProcessor({
        fromText: 'alpha, beta',
        processor: alwaysFails,
        converterArgs: [],
        bulkErrorTranslation: 'All failed',
      });

      expect(result).toEqual({
        result: 'Failed on alpha\nFailed on beta',
        error: 'All failed',
      });
    });
  });
});
