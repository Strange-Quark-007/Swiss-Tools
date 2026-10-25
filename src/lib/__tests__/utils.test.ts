import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { testT } from '@/test-helpers/i18n';

import {
  defineExhaustiveSet,
  defineExhaustiveTuple,
  exhaustiveCheck,
  getFirst,
  getPageTitle,
  getRoutePrefix,
} from '../utils';

describe('utils', () => {
  describe('defineExhaustiveTuple', () => {
    it('should return the provided tuple when exhaustive', () => {
      type Fruit = 'apple' | 'banana';
      const fruits = defineExhaustiveTuple<Fruit>()(['apple', 'banana']);
      expect(fruits).toEqual(['apple', 'banana']);
    });

    it('should reject a tuple that misses a union member at compile time', () => {
      type Fruit = 'apple' | 'banana';
      // @ts-expect-error - 'banana' is missing from the tuple
      expect(defineExhaustiveTuple<Fruit>()(['apple'])).toEqual(['apple']);
    });

    it('should reject a tuple that contains a non-member at compile time', () => {
      type Fruit = 'apple' | 'banana';
      // @ts-expect-error - 'orange' is not a member of Fruit
      expect(defineExhaustiveTuple<Fruit>()(['apple', 'banana', 'orange'])).toHaveLength(3);
    });

    it('should require an explicit union type argument', () => {
      // @ts-expect-error - omitting the union leaves `U` as `unknown`, so the call must fail
      expect(defineExhaustiveTuple()(['apple', 'banana'])).toEqual(['apple', 'banana']);
    });
  });

  describe('defineExhaustiveSet', () => {
    it('should return a Set containing all provided elements and narrow via has', () => {
      type Fruit = 'apple' | 'banana';
      const fruitSet = defineExhaustiveSet<Fruit>()(['apple', 'banana']);
      expect(fruitSet.has('apple')).toBe(true);
      expect(fruitSet.has('orange')).toBe(false);
      expect(Array.from(fruitSet)).toEqual(['apple', 'banana']);
    });

    it('should reject a set that misses a union member at compile time', () => {
      type Fruit = 'apple' | 'banana';
      // @ts-expect-error - 'banana' is missing from the set
      expect(defineExhaustiveSet<Fruit>()(['apple'])).toBeInstanceOf(Set);
    });

    it('should require an explicit union type argument', () => {
      // @ts-expect-error - omitting the union leaves `U` as `unknown`, so the call must fail
      expect(defineExhaustiveSet()(['apple', 'banana'])).toBeInstanceOf(Set);
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

  describe('getRoutePrefix', () => {
    it('should return home for empty or root slash', () => {
      expect(getRoutePrefix('')).toBe('home');
      expect(getRoutePrefix('/')).toBe('home');
    });

    it('should convert single-segment kebab routes to camelCase prefix', () => {
      expect(getRoutePrefix(ROUTES.CASE_CONVERTER)).toBe('caseConverter');
      expect(getRoutePrefix(ROUTES.COLOR_PICKER)).toBe('colorPicker');
      expect(getRoutePrefix(ROUTES.DATA_FORMAT_CONVERTER)).toBe('dataFormatConverter');
      expect(getRoutePrefix(ROUTES.ENCODER_DECODER)).toBe('encoderDecoder');
      expect(getRoutePrefix(ROUTES.HASH_GENERATOR)).toBe('hashGenerator');
      expect(getRoutePrefix(ROUTES.ID_GENERATOR)).toBe('idGenerator');
      expect(getRoutePrefix(ROUTES.JWT_DECODER)).toBe('jwtDecoder');
      expect(getRoutePrefix(ROUTES.LOREM_GENERATOR)).toBe('loremGenerator');
      expect(getRoutePrefix(ROUTES.NUMBER_CONVERTER)).toBe('numberConverter');
    });

    it('should convert multi-segment unit converter routes to <unit>Converter prefix', () => {
      expect(getRoutePrefix(ROUTES.LENGTH_CONVERTER)).toBe('lengthConverter');
      expect(getRoutePrefix(ROUTES.AREA_CONVERTER)).toBe('areaConverter');
      expect(getRoutePrefix(ROUTES.VOLUME_CONVERTER)).toBe('volumeConverter');
      expect(getRoutePrefix(ROUTES.WEIGHT_CONVERTER)).toBe('weightConverter');
      expect(getRoutePrefix(ROUTES.TEMPERATURE_CONVERTER)).toBe('temperatureConverter');
      expect(getRoutePrefix(ROUTES.TIME_CONVERTER)).toBe('timeConverter');
      expect(getRoutePrefix(ROUTES.SPEED_CONVERTER)).toBe('speedConverter');
      expect(getRoutePrefix(ROUTES.PRESSURE_CONVERTER)).toBe('pressureConverter');
      expect(getRoutePrefix(ROUTES.POWER_CONVERTER)).toBe('powerConverter');
      expect(getRoutePrefix(ROUTES.DATA_SIZE_CONVERTER)).toBe('dataSizeConverter');
    });

    it('should convert string pathnames matching unit converters', () => {
      expect(getRoutePrefix('/unit-converter/length')).toBe('lengthConverter');
      expect(getRoutePrefix('/unit-converter/data-size')).toBe('dataSizeConverter');
    });

    it('should fallback to kebab-to-camelCase conversion for unlisted or custom routes', () => {
      expect(getRoutePrefix('/custom-tool')).toBe('customTool');
      expect(getRoutePrefix('/nested/custom-tool')).toBe('nestedCustomTool');
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

    it('should convert unit converter routes to converter translation key', () => {
      expect(getPageTitle('/unit-converter/data-size', testT)).toBe(testT('dataSizeConverter.name'));
      expect(getPageTitle('/unit-converter/temperature', testT)).toBe(testT('temperatureConverter.name'));
    });
  });
});
