import { describe, it, expect, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import {
  BASES,
  isValidCustomBase,
  getCustomBaseValidationRules,
  validateCustomBase,
  getBaseNumber,
  isValidInput,
  convertNumber,
  bulkConvertNumbers,
} from '../utils';

describe('number-converter utils', () => {
  describe('BASES constant', () => {
    it('should have correct configuration for all predefined bases', () => {
      expect(BASES.binary.baseNum).toBe(2);
      expect(BASES.octal.baseNum).toBe(8);
      expect(BASES.decimal.baseNum).toBe(10);
      expect(BASES.hex.baseNum).toBe(16);
      expect(BASES.custom.baseNum).toBeNull();
      expect(BASES.custom.regex).toBeNull();
    });
  });

  describe('isValidCustomBase', () => {
    it('should return true for integers between 2 and 36', () => {
      expect(isValidCustomBase('2')).toBe(true);
      expect(isValidCustomBase('16')).toBe(true);
      expect(isValidCustomBase('36')).toBe(true);
    });

    it('should return false for out-of-range bases or numbers > 36', () => {
      expect(isValidCustomBase('37')).toBe(false);
      expect(isValidCustomBase('100')).toBe(false);
    });

    it('should return false for empty or non-numeric inputs', () => {
      expect(isValidCustomBase('')).toBe(false);
      expect(isValidCustomBase('   ')).toBe(false);
      expect(isValidCustomBase('abc')).toBe(false);
    });
  });

  describe('getCustomBaseValidationRules', () => {
    it('should return validation rules with required and inRange checks', () => {
      const rules = getCustomBaseValidationRules(testT);

      expect(rules.required).toBe(testT('numberConverter.baseRequired'));
      expect(rules.validate).toBeDefined();

      const validate = rules.validate as Record<string, (val: string) => boolean | string>;
      expect(validate.inRange('16')).toBe(true);
      expect(validate.inRange('40')).toBe(testT('numberConverter.baseRange'));
    });
  });

  describe('validateCustomBase', () => {
    it('should return the string value if valid, or empty string if invalid', () => {
      expect(validateCustomBase('16')).toBe('16');
      expect(validateCustomBase('50')).toBe('');
      expect(validateCustomBase('xyz')).toBe('');
    });
  });

  describe('getBaseNumber', () => {
    it('should return correct base number for predefined base keys', () => {
      expect(getBaseNumber(BASES.binary.value)).toBe(2);
      expect(getBaseNumber(BASES.octal.value)).toBe(8);
      expect(getBaseNumber(BASES.decimal.value)).toBe(10);
      expect(getBaseNumber(BASES.hex.value)).toBe(16);
      expect(getBaseNumber(BASES.custom.value)).toBeNull();
    });

    it('should parse valid custom numeric bases from 2 to 36', () => {
      expect(getBaseNumber('2')).toBe(2);
      expect(getBaseNumber('5')).toBe(5);
      expect(getBaseNumber('36')).toBe(36);
    });

    it('should return null for invalid, undefined, or out-of-bound bases', () => {
      expect(getBaseNumber(undefined)).toBeNull();
      expect(getBaseNumber('1')).toBeNull();
      expect(getBaseNumber('37')).toBeNull();
      expect(getBaseNumber('invalid')).toBeNull();
    });
  });

  describe('isValidInput', () => {
    it('should treat empty or whitespace-only input as valid with no invalid characters', () => {
      expect(isValidInput('', BASES.binary.value)).toEqual({ valid: true, invalidChars: [] });
      expect(isValidInput('   ', BASES.hex.value)).toEqual({ valid: true, invalidChars: [] });
    });

    it('should validate binary input and detect invalid characters', () => {
      expect(isValidInput('10101', BASES.binary.value)).toEqual({ valid: true, invalidChars: [] });
      expect(isValidInput('-1010', BASES.binary.value)).toEqual({ valid: true, invalidChars: [] });

      const invalid = isValidInput('1023a', BASES.binary.value);
      expect(invalid.valid).toBe(false);
      expect(invalid.invalidChars).toEqual(['2', '3', 'a']);
    });

    it('should validate hexadecimal input including mixed case and signs', () => {
      expect(isValidInput('1aF', BASES.hex.value)).toEqual({ valid: true, invalidChars: [] });
      expect(isValidInput('-9bC', BASES.hex.value)).toEqual({ valid: true, invalidChars: [] });

      const invalid = isValidInput('1aFzG', BASES.hex.value);
      expect(invalid.valid).toBe(false);
      expect(invalid.invalidChars).toEqual(['z', 'G']);
    });

    it('should validate custom numeric bases <= 10', () => {
      expect(isValidInput('1234', '5')).toEqual({ valid: true, invalidChars: [] });

      const invalid = isValidInput('12345', '5');
      expect(invalid.valid).toBe(false);
      expect(invalid.invalidChars).toEqual(['5']);
    });

    it('should validate custom numeric bases > 10', () => {
      expect(isValidInput('129aB', '12')).toEqual({ valid: true, invalidChars: [] });

      const invalid = isValidInput('129aBc', '12'); // 'c' exceeds base 12
      expect(invalid.valid).toBe(false);
      expect(invalid.invalidChars).toEqual(['c']);
    });

    it('should return invalid for completely invalid custom base', () => {
      expect(isValidInput('123', 'invalid-base')).toEqual({ valid: false, invalidChars: [] });
    });

    it('should return invalid when base is custom without a regex pattern', () => {
      expect(isValidInput('123', BASES.custom.value)).toEqual({ valid: false, invalidChars: [] });
    });
  });

  describe('bulkConvertNumbers', () => {
    it('should return empty result for empty input or lone minus sign', () => {
      expect(bulkConvertNumbers('', BASES.decimal.value, BASES.binary.value, testT)).toEqual({
        result: '',
      });
      expect(bulkConvertNumbers('   ', BASES.decimal.value, BASES.binary.value, testT)).toEqual({
        result: '',
      });
      expect(bulkConvertNumbers('-', BASES.decimal.value, BASES.binary.value, testT)).toEqual({
        result: '',
      });
    });

    it('should convert standard predefined bases correctly', () => {
      // Decimal to Binary
      expect(bulkConvertNumbers('10', BASES.decimal.value, BASES.binary.value, testT).result).toBe('1010');

      // Binary to Decimal
      expect(bulkConvertNumbers('1010', BASES.binary.value, BASES.decimal.value, testT).result).toBe('10');

      // Decimal to Hex
      expect(bulkConvertNumbers('255', BASES.decimal.value, BASES.hex.value, testT).result).toBe('ff');

      // Octal to Decimal
      expect(bulkConvertNumbers('77', BASES.octal.value, BASES.decimal.value, testT).result).toBe('63');
    });

    it('should handle negative numbers correctly', () => {
      expect(bulkConvertNumbers('-10', BASES.decimal.value, BASES.binary.value, testT).result).toBe('-1010');
      expect(bulkConvertNumbers('-ff', BASES.hex.value, BASES.decimal.value, testT).result).toBe('-255');
    });

    it('should convert between custom numeric bases', () => {
      // Base 3 '12' (1*3 + 2 = 5) to Base 7 -> '5'
      expect(bulkConvertNumbers('12', '3', '7', testT).result).toBe('5');
    });

    it('should process multiple numbers separated by commas and newlines', () => {
      const input = '10, 20\n30';
      const { result } = bulkConvertNumbers(input, BASES.decimal.value, BASES.hex.value, testT);
      expect(result).toBe('a\n14\n1e');
    });

    it('should return error when fromBase is missing or invalid', () => {
      const { error } = bulkConvertNumbers('10', undefined, BASES.binary.value, testT);
      expect(error).toBe(testT('converter.bulkConverterWithErrors'));
    });

    it('should return error when toBase is missing or invalid', () => {
      const { error } = bulkConvertNumbers('10', BASES.decimal.value, undefined, testT);
      expect(error).toBe(testT('converter.bulkConverterWithErrors'));
    });

    it('should return error when input contains characters invalid for source base', () => {
      const { result, error } = bulkConvertNumbers('102', BASES.binary.value, BASES.decimal.value, testT);
      expect(result).toContain(testT('numberConverter.invalidCharacters', { chars: '[2]', base: 'Binary' }));
      expect(error).toBe(testT('converter.bulkConverterWithErrors'));
    });

    it('should handle partial failures in bulk conversion and aggregate errors', () => {
      const input = '1010\n102\n1111';
      const { result, error } = bulkConvertNumbers(input, BASES.binary.value, BASES.decimal.value, testT);

      expect(result).toContain('10');
      expect(result).toContain('15');
      expect(result).toContain(testT('numberConverter.invalidCharacters', { chars: '[2]', base: 'Binary' }));
      expect(error).toBe(testT('converter.bulkConverterWithErrors'));
    });

    it('should handle whitespace-only lines within multiline input without errors', () => {
      const input = '10\n   \n20';
      const { result } = bulkConvertNumbers(input, BASES.decimal.value, BASES.hex.value, testT);
      expect(result).toBe('a\n14');
    });

    it('should catch and handle unexpected conversion errors gracefully', () => {
      const spy = vi.spyOn(Number.prototype, 'toString').mockImplementationOnce(() => {
        throw new Error('Simulated conversion failure');
      });

      const { result, error } = bulkConvertNumbers('10', BASES.decimal.value, BASES.binary.value, testT);
      expect(result).toBe('10 → Error converting');
      expect(error).toBe(testT('converter.bulkConverterWithErrors'));

      spy.mockRestore();
    });
  });

  describe('convertNumber', () => {
    it('should return empty result for empty or whitespace-only inputs', () => {
      expect(convertNumber('', BASES.decimal.value, BASES.binary.value, testT)).toEqual({ result: '' });
      expect(convertNumber('   ', BASES.decimal.value, BASES.binary.value, testT)).toEqual({ result: '' });
    });

    it('should format error with custom base label when custom source base is invalid', () => {
      const { result, error } = convertNumber('12z', '12', BASES.decimal.value, testT);
      expect(result).toBe('');
      expect(error).toBe(`12z → ${testT('numberConverter.invalidCharacters', { chars: '[z]', base: 'Base 12' })}`);
    });
  });
});
