import { describe, it, expect } from 'vitest';

import { StringUtils } from '../string-utils';

describe('StringUtils', () => {
  describe('constructor and from()', () => {
    it('should trim whitespace and normalize Unicode to NFC', () => {
      expect(StringUtils.from('  cafe\u0301  ').toString()).toBe('café');
    });

    it('should handle an empty string', () => {
      expect(StringUtils.from('').toString()).toBe('');
    });

    it('should handle whitespace-only input', () => {
      expect(StringUtils.from('   \t\n ').toString()).toBe('');
    });

    it('should normalize equivalent Unicode strings', () => {
      expect(StringUtils.from('é').toString()).toBe(StringUtils.from('e\u0301').toString());
    });
  });

  describe('sanitize()', () => {
    it('should replace punctuation and symbols with spaces', () => {
      expect(StringUtils.from('hello@ world!').sanitize().toString()).toBe('hello world');
    });

    it('should preserve Unicode letters and numbers', () => {
      expect(StringUtils.from('café 東京 你好 १२३').sanitize().toString()).toBe('café 東京 你好 १२३');
    });

    it('should replace repeated punctuation and separators with spaces', () => {
      expect(StringUtils.from('a....b____c----d').sanitize().toString()).toBe('a b c d');
    });

    it('should collapse whitespace and trim the result', () => {
      expect(StringUtils.from('  hello   \t world  ').sanitize().toString()).toBe('hello world');
    });

    it('should handle strings containing only punctuation', () => {
      expect(StringUtils.from('@#$!').sanitize().toString()).toBe('');
    });
  });

  describe('capitalize()', () => {
    it('should capitalize the first character', () => {
      expect(StringUtils.from('hello').capitalize().toString()).toBe('Hello');
    });

    it('should preserve the remaining characters', () => {
      expect(StringUtils.from('hELLO').capitalize().toString()).toBe('HELLO');
    });

    it('should not change an already capitalized string', () => {
      expect(StringUtils.from('Hello').capitalize().toString()).toBe('Hello');
    });
  });

  describe('parseFromKebab()', () => {
    it('should replace hyphens with spaces', () => {
      expect(StringUtils.from('hello-world').parseFromKebab().toString()).toBe('hello world');
    });

    it('should collapse repeated hyphens and whitespace', () => {
      expect(StringUtils.from('hello---world   again').parseFromKebab().toString()).toBe('hello world again');
    });
  });

  describe('parseFromSnake()', () => {
    it('should replace underscores with spaces', () => {
      expect(StringUtils.from('hello_world').parseFromSnake().toString()).toBe('hello world');
    });

    it('should collapse repeated underscores and whitespace', () => {
      expect(StringUtils.from('hello___world   again').parseFromSnake().toString()).toBe('hello world again');
    });
  });

  describe('parseFromDot()', () => {
    it('should replace periods with spaces', () => {
      expect(StringUtils.from('hello.world').parseFromDot().toString()).toBe('hello world');
    });

    it('should collapse repeated periods and whitespace', () => {
      expect(StringUtils.from('hello...world   again').parseFromDot().toString()).toBe('hello world again');
    });
  });

  describe('parseFromCamel()', () => {
    it('should split camelCase words', () => {
      expect(StringUtils.from('helloWorld').parseFromCamel().toString()).toBe('hello World');
    });

    it('should split consecutive uppercase acronyms before a capitalized word', () => {
      expect(StringUtils.from('XMLParser').parseFromCamel().toString()).toBe('XML Parser');
    });

    it('should split acronym boundaries within a string', () => {
      expect(StringUtils.from('parseHTTPResponse').parseFromCamel().toString()).toBe('parse HTTP Response');
    });

    it('should split lowercase-to-uppercase boundaries', () => {
      expect(StringUtils.from('myURLValue').parseFromCamel().toString()).toBe('my URL Value');
    });

    it('should normalize whitespace', () => {
      expect(StringUtils.from('hello   World').parseFromCamel().toString()).toBe('hello World');
    });
  });

  describe('parseFromPascal()', () => {
    it('should normalize whitespace', () => {
      expect(StringUtils.from('Hello   World').parseFromPascal().toString()).toBe('Hello World');
    });

    it('should split PascalCase words', () => {
      expect(StringUtils.from('HelloWorld').parseFromPascal().toString()).toBe('Hello World');
    });

    it('should split lowercase-to-uppercase boundaries', () => {
      expect(StringUtils.from('parseHTTPResponse').parseFromPascal().toString()).toBe('parse HTTP Response');
    });

    it('should split consecutive uppercase acronyms before a capitalized word', () => {
      expect(StringUtils.from('XMLParser').parseFromPascal().toString()).toBe('XML Parser');
    });

    it('should split acronym boundaries within a string', () => {
      expect(StringUtils.from('HTTPSConnection').parseFromPascal().toString()).toBe('HTTPS Connection');
    });
  });

  describe('toTitleCase()', () => {
    it('should capitalize the first letter of every word', () => {
      expect(StringUtils.from('hello world').toTitleCase().toString()).toBe('Hello World');
    });

    it('should lowercase the remaining letters in each word', () => {
      expect(StringUtils.from('hELLO wORLD').toTitleCase().toString()).toBe('Hello World');
    });

    it('should collapse repeated whitespace', () => {
      expect(StringUtils.from('hello   world').toTitleCase().toString()).toBe('Hello World');
    });
  });

  describe('toCamelCase()', () => {
    it('should convert space-separated words', () => {
      expect(StringUtils.from('hello world').toCamelCase().toString()).toBe('helloWorld');
    });

    it('should convert kebab-case', () => {
      expect(StringUtils.from('hello-world').toCamelCase().toString()).toBe('helloWorld');
    });

    it('should convert snake_case', () => {
      expect(StringUtils.from('hello_world').toCamelCase().toString()).toBe('helloWorld');
    });

    it('should lowercase the first word', () => {
      expect(StringUtils.from('Hello World').toCamelCase().toString()).toBe('helloWorld');
    });

    it('should normalize mixed separators before converting to camelCase', () => {
      expect(StringUtils.from('a..b---c___d').sanitize().toCamelCase().toString()).toBe('aBCD');
    });

    it('should not introduce spaces for a single word', () => {
      expect(StringUtils.from('hello').toCamelCase().toString()).toBe('hello');
    });
  });

  describe('toPascalCase()', () => {
    it('should capitalize the first letter of camelCase output', () => {
      expect(StringUtils.from('hello world').toPascalCase().toString()).toBe('HelloWorld');
    });
  });

  describe('toSnakeCase()', () => {
    it('should convert spaces to underscores and lowercase', () => {
      expect(StringUtils.from('Hello World').toSnakeCase().toString()).toBe('hello_world');
    });

    it('should collapse whitespace into a single underscore', () => {
      expect(StringUtils.from('hello   world').toSnakeCase().toString()).toBe('hello_world');
    });
  });

  describe('toKebabCase()', () => {
    it('should convert spaces to hyphens and lowercase', () => {
      expect(StringUtils.from('Hello World').toKebabCase().toString()).toBe('hello-world');
    });

    it('should collapse whitespace into a single hyphen', () => {
      expect(StringUtils.from('hello   world').toKebabCase().toString()).toBe('hello-world');
    });
  });

  describe('toDotCase()', () => {
    it('should convert spaces to periods and lowercase', () => {
      expect(StringUtils.from('Hello World').toDotCase().toString()).toBe('hello.world');
    });

    it('should collapse whitespace into a single period', () => {
      expect(StringUtils.from('hello   world').toDotCase().toString()).toBe('hello.world');
    });
  });

  describe('toAscii()', () => {
    it('should remove Latin diacritics', () => {
      expect(StringUtils.from('café résumé').toAscii().toString()).toBe('cafe resume');
    });

    it('should preserve ASCII characters', () => {
      expect(StringUtils.from('Hello 123!').toAscii().toString()).toBe('Hello 123!');
    });

    it('should not claim to transliterate non-Latin scripts', () => {
      expect(StringUtils.from('東京').toAscii().toString()).toBe('東京');
    });
  });

  describe('toString() and valueOf()', () => {
    it('should return the current string trimmed', () => {
      expect(StringUtils.from(' hello ').toString()).toBe('hello');
    });

    it('should return the same value from valueOf()', () => {
      const utils = StringUtils.from('hello world');

      expect(utils.valueOf()).toBe(utils.toString());
    });

    it('should reflect transformations performed before conversion', () => {
      expect(StringUtils.from('hello world').toSnakeCase().toString()).toBe('hello_world');
    });
  });

  describe('fluent API', () => {
    it('should return the same instance from transformation methods', () => {
      const utils = StringUtils.from('hello world');

      expect(utils.capitalize()).toBe(utils);
      expect(utils.toSnakeCase()).toBe(utils);
      expect(utils.sanitize()).toBe(utils);
    });

    it('should support chaining transformations', () => {
      expect(StringUtils.from('  Hello World!  ').sanitize().toKebabCase().toString()).toBe('hello-world');
    });
  });
});
