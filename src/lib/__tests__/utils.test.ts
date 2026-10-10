import { describe, it, expect } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { cn, exhaustiveCheck, getFirst, getPageTitle } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('p-2', 'p-4', 'font-bold')).toBe('p-4 font-bold');
    });
  });

  describe('exhaustiveCheck', () => {
    it('should throw an error with the unexpected value message', () => {
      expect(() => exhaustiveCheck('unknown-case' as never)).toThrow('Unexpected case: unknown-case');
    });
  });

  describe('getFirst', () => {
    it('should return undefined when value is undefined', () => {
      expect(getFirst(undefined)).toBeUndefined();
    });

    it('should return the string itself when value is a string', () => {
      expect(getFirst('test-string')).toBe('test-string');
    });

    it('should return the first element when value is an array of strings', () => {
      expect(getFirst(['first', 'second', 'third'])).toBe('first');
    });

    it('should return undefined when value is an empty array', () => {
      expect(getFirst([])).toBeUndefined();
    });
  });

  describe('getPageTitle', () => {
    it('should return home title for empty pathname or root slash', () => {
      expect(getPageTitle('', testT)).toBe(testT('home.name'));
      expect(getPageTitle('/', testT)).toBe(testT('home.name'));
    });

    it('should convert single-segment kebab-case route to camelCase translation key', () => {
      expect(getPageTitle('/case-converter', testT)).toBe(testT('caseConverter.name'));
      expect(getPageTitle('/hash-generator', testT)).toBe(testT('hashGenerator.name'));
    });

    it('should join and convert multi-segment routes to camelCase translation key', () => {
      expect(getPageTitle('/unit-converter/data-size', testT)).toBe(testT('unitConverterDataSize.name'));
      expect(getPageTitle('/unit-converter/temperature', testT)).toBe(testT('unitConverterTemperature.name'));
    });
  });
});
