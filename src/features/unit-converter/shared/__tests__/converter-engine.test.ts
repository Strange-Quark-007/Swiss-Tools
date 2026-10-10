import { describe, it, expect } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import {
  convertUnitValue,
  createUnitConverter,
  formatConvertedValue,
  UnitConversionConfig,
} from '../converter-engine';

describe('converter-engine', () => {
  describe('convertUnitValue', () => {
    it('should convert pure ratio values when offset is absent', () => {
      const from: UnitConversionConfig = { scale: 1000 };
      const to: UnitConversionConfig = { scale: 1 };

      expect(convertUnitValue(2.5, from, to)).toBe(2500);
      expect(convertUnitValue(2500, to, from)).toBe(2.5);
    });

    it('should convert affine values with offset correctly (e.g. Celsius <-> Fahrenheit)', () => {
      const celsius: UnitConversionConfig = { scale: 1, offset: 0 };
      const fahrenheit: UnitConversionConfig = { scale: 5 / 9, offset: -32 };

      expect(convertUnitValue(100, celsius, fahrenheit)).toBe(212);
      expect(convertUnitValue(212, fahrenheit, celsius)).toBe(100);
      expect(convertUnitValue(0, celsius, fahrenheit)).toBe(32);
      expect(convertUnitValue(32, fahrenheit, celsius)).toBe(0);
    });

    it('should normalize tiny floating point results near zero to 0', () => {
      const unitA: UnitConversionConfig = { scale: 1, offset: -10 };
      const unitB: UnitConversionConfig = { scale: 1, offset: -10 };

      const result = convertUnitValue(10, unitA, unitB);
      expect(result).toBe(10);
      expect(Object.is(result, -0)).toBe(false);
    });
  });

  describe('formatConvertedValue', () => {
    it('should format numbers with default precision 3 and trim trailing zeros', () => {
      expect(formatConvertedValue(12.3456)).toBe('12.346');
      expect(formatConvertedValue(12.3)).toBe('12.3');
      expect(formatConvertedValue(12.0)).toBe('12');
      expect(formatConvertedValue(0)).toBe('0');
    });

    it('should support custom precision', () => {
      expect(formatConvertedValue(12.3456, 2)).toBe('12.35');
      expect(formatConvertedValue(12.3456, 4)).toBe('12.3456');
    });
  });

  describe('createUnitConverter', () => {
    const table: Record<'m' | 'km', UnitConversionConfig> = {
      m: { scale: 1 },
      km: { scale: 1000 },
    };

    const { convert, bulkConvert } = createUnitConverter(table);

    it('should return empty result for blank input', () => {
      expect(convert('', 'm', 'km', testT)).toEqual({ result: '' });
      expect(convert('   \t  ', 'm', 'km', testT)).toEqual({ result: '' });
    });

    it('should return error for invalid numeric input', () => {
      expect(convert('abc', 'm', 'km', testT)).toEqual({
        result: '',
        error: `abc → ${testT('label.invalidInput')}`,
      });
    });

    it('should convert valid inputs', () => {
      expect(convert('5000', 'm', 'km', testT)).toEqual({ result: '5' });
      expect(convert('2.5', 'km', 'm', testT)).toEqual({ result: '2500' });
    });

    it('should support bulk conversion with bulkConvert', () => {
      const res = bulkConvert('1000\n2000', 'm', 'km', testT);
      expect(res.result).toBe('1\n2');
      expect(res.error).toBeUndefined();
    });
  });
});
