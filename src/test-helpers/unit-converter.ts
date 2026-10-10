import { describe, it, expect } from 'vitest';

import { TranslationFunction } from '@/i18n/utils';
import { ConverterResult } from '@/types/common';

import { testT } from './i18n';

export interface UnitConverterTestCase<T> {
  from: T;
  to: T;
  input: string;
  expected: string;
}

export interface UnitConverterTestConfig<T> {
  converterName: string;
  bulkConvert: (fromText: string, from: T, to: T, t: TranslationFunction) => ConverterResult;
  convert: (fromText: string, from: T, to: T, t: TranslationFunction) => ConverterResult;
  defaultUnits: {
    from: T;
    to: T;
  };
  testCases: UnitConverterTestCase<T>[];
}

export const describeUnitConverter = <T extends string>(config: UnitConverterTestConfig<T>) => {
  const { converterName, bulkConvert, convert, defaultUnits, testCases } = config;

  describe(`${converterName} converter`, () => {
    describe('validation and edge cases', () => {
      it('should return empty result for empty or whitespace-only input', () => {
        expect(bulkConvert('', defaultUnits.from, defaultUnits.to, testT)).toEqual({
          result: '',
        });
        expect(bulkConvert('   \n  \t  ', defaultUnits.from, defaultUnits.to, testT)).toEqual({
          result: '',
        });
        expect(convert('', defaultUnits.from, defaultUnits.to, testT)).toEqual({
          result: '',
        });
        expect(convert('   \t  ', defaultUnits.from, defaultUnits.to, testT)).toEqual({
          result: '',
        });
      });

      it('should return an error for non-numeric input', () => {
        const res = bulkConvert('invalid', defaultUnits.from, defaultUnits.to, testT);
        expect(res.result).toBe(`invalid → ${testT('label.invalidInput')}`);
        expect(res.error).toBe(testT('converter.bulkConverterWithErrors'));

        const singleRes = convert('invalid', defaultUnits.from, defaultUnits.to, testT);
        expect(singleRes.result).toBe('');
        expect(singleRes.error).toBe(`invalid → ${testT('label.invalidInput')}`);
      });
    });

    describe('unit conversions', () => {
      testCases.forEach(({ from, to, input, expected }) => {
        it(`should convert ${input} from ${from} to ${to} resulting in ${expected}`, () => {
          const res = bulkConvert(input, from, to, testT);
          expect(res.error).toBeUndefined();
          expect(res.result).toBe(expected);

          const singleRes = convert(input, from, to, testT);
          expect(singleRes.error).toBeUndefined();
          expect(singleRes.result).toBe(expected);
        });
      });
    });

    describe('bulk conversion', () => {
      it('should handle multi-line inputs with mixed valid and invalid lines', () => {
        const [first, second] = testCases;
        const multiLine = `${first.input}\ninvalid\n${second.input}`;

        const res = bulkConvert(multiLine, first.from, first.to, testT);
        expect(res.result).toContain(first.expected);
        expect(res.result).toContain(`invalid → ${testT('label.invalidInput')}`);
        expect(res.error).toBe(testT('converter.bulkConverterWithErrors'));
      });
    });
  });
};
