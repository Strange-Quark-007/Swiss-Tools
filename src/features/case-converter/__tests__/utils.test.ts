import { describe, it, expect } from 'vitest';

import { CASES, bulkConvertTextCase } from '../utils';

describe('case-converter utils', () => {
  describe('CASES constant', () => {
    it('should have all 9 case definitions with correct value and label', () => {
      expect(CASES.lowercase).toEqual({ value: 'lowercase', label: 'lowercase' });
      expect(CASES.uppercase).toEqual({ value: 'uppercase', label: 'UPPERCASE' });
      expect(CASES.titlecase).toEqual({ value: 'titlecase', label: 'Title Case' });
      expect(CASES.sentencecase).toEqual({ value: 'sentencecase', label: 'Sentence case' });
      expect(CASES.camelcase).toEqual({ value: 'camelcase', label: 'camelCase' });
      expect(CASES.pascalcase).toEqual({ value: 'pascalcase', label: 'PascalCase' });
      expect(CASES.snakecase).toEqual({ value: 'snakecase', label: 'snake_case' });
      expect(CASES.kebabcase).toEqual({ value: 'kebabcase', label: 'kebab-case' });
      expect(CASES.dotcase).toEqual({ value: 'dotcase', label: 'dot.case' });
    });
  });

  describe('bulkConvertTextCase - empty and whitespace inputs', () => {
    it('should return empty result for empty string', () => {
      const { result } = bulkConvertTextCase('', CASES.lowercase.value, CASES.uppercase.value);
      expect(result).toBe('');
    });

    it('should return empty result for whitespace-only string', () => {
      const { result } = bulkConvertTextCase('   \n\t  ', CASES.camelcase.value, CASES.snakecase.value);
      expect(result).toBe('');
    });
  });

  describe('bulkConvertTextCase - targeting all toCase options', () => {
    const input = 'hello world';

    it('should convert to lowercase', () => {
      const { result } = bulkConvertTextCase('HELLO WORLD', CASES.uppercase.value, CASES.lowercase.value);
      expect(result).toBe('hello world');
    });

    it('should convert to UPPERCASE', () => {
      const { result } = bulkConvertTextCase(input, CASES.lowercase.value, CASES.uppercase.value);
      expect(result).toBe('HELLO WORLD');
    });

    it('should convert to Title Case', () => {
      const { result } = bulkConvertTextCase(input, CASES.lowercase.value, CASES.titlecase.value);
      expect(result).toBe('Hello World');
    });

    it('should convert to Sentence case', () => {
      const { result } = bulkConvertTextCase(
        'hello world. how are you.',
        CASES.lowercase.value,
        CASES.sentencecase.value
      );
      expect(result).toBe('Hello world. How are you.');
    });

    it('should convert to camelCase', () => {
      const { result } = bulkConvertTextCase(input, CASES.lowercase.value, CASES.camelcase.value);
      expect(result).toBe('helloWorld');
    });

    it('should convert to PascalCase', () => {
      const { result } = bulkConvertTextCase(input, CASES.lowercase.value, CASES.pascalcase.value);
      expect(result).toBe('HelloWorld');
    });

    it('should convert to snake_case', () => {
      const { result } = bulkConvertTextCase(input, CASES.lowercase.value, CASES.snakecase.value);
      expect(result).toBe('hello_world');
    });

    it('should convert to kebab-case', () => {
      const { result } = bulkConvertTextCase(input, CASES.lowercase.value, CASES.kebabcase.value);
      expect(result).toBe('hello-world');
    });

    it('should convert to dot.case', () => {
      const { result } = bulkConvertTextCase(input, CASES.lowercase.value, CASES.dotcase.value);
      expect(result).toBe('hello.world');
    });
  });

  describe('bulkConvertTextCase - input parsing fromCase options', () => {
    it('should parse from camelCase', () => {
      const { result } = bulkConvertTextCase('helloWorldFoo', CASES.camelcase.value, CASES.snakecase.value);
      expect(result).toBe('hello_world_foo');
    });

    it('should parse from PascalCase', () => {
      const { result } = bulkConvertTextCase('HelloWorldFoo', CASES.pascalcase.value, CASES.kebabcase.value);
      expect(result).toBe('hello-world-foo');
    });

    it('should parse from snake_case', () => {
      const { result } = bulkConvertTextCase('hello_world_foo', CASES.snakecase.value, CASES.camelcase.value);
      expect(result).toBe('helloWorldFoo');
    });

    it('should parse from kebab-case', () => {
      const { result } = bulkConvertTextCase('hello-world-foo', CASES.kebabcase.value, CASES.pascalcase.value);
      expect(result).toBe('HelloWorldFoo');
    });

    it('should parse from dot.case', () => {
      const { result } = bulkConvertTextCase('hello.world.foo', CASES.dotcase.value, CASES.snakecase.value);
      expect(result).toBe('hello_world_foo');
    });

    it('should handle raw input from Title Case / Sentence case', () => {
      const { result: fromTitle } = bulkConvertTextCase(
        'Hello World',
        CASES.titlecase.value,
        CASES.kebabcase.value
      );
      expect(fromTitle).toBe('hello-world');

      const { result: fromSentence } = bulkConvertTextCase(
        'Hello world',
        CASES.sentencecase.value,
        CASES.snakecase.value
      );
      expect(fromSentence).toBe('hello_world');
    });
  });

  describe('bulkConvertTextCase - multiline processing', () => {
    it('should convert multiple lines independently preserving line order', () => {
      const multilineInput = 'first_name\nlast_name\nuser_email_address';
      const { result } = bulkConvertTextCase(multilineInput, CASES.snakecase.value, CASES.camelcase.value);

      expect(result).toBe('firstName\nlastName\nuserEmailAddress');
    });

    it('should preserve commas within lines because delimiter is strictly newline', () => {
      const lineWithComma = 'hello, world\nfoo, bar';
      const { result } = bulkConvertTextCase(lineWithComma, CASES.lowercase.value, CASES.uppercase.value);

      expect(result).toBe('HELLO, WORLD\nFOO, BAR');
    });

    it('should filter out blank lines between items', () => {
      const inputWithEmptyLines = 'item_one\n\n\nitem_two';
      const { result } = bulkConvertTextCase(inputWithEmptyLines, CASES.snakecase.value, CASES.kebabcase.value);

      expect(result).toBe('item-one\nitem-two');
    });
  });

  describe('bulkConvertTextCase - edge cases', () => {
    it('should convert single-word identifiers', () => {
      expect(bulkConvertTextCase('hello', CASES.lowercase.value, CASES.uppercase.value).result).toBe('HELLO');
      expect(bulkConvertTextCase('hello', CASES.lowercase.value, CASES.pascalcase.value).result).toBe('Hello');
      expect(bulkConvertTextCase('hello', CASES.lowercase.value, CASES.camelcase.value).result).toBe('hello');
    });

    it('should handle alphanumeric input with numbers', () => {
      expect(bulkConvertTextCase('item_123_value', CASES.snakecase.value, CASES.camelcase.value).result).toBe(
        'item123Value'
      );
      expect(bulkConvertTextCase('itemOne123', CASES.camelcase.value, CASES.snakecase.value).result).toBe(
        'item_one123'
      );
    });

    it('should handle acronyms in PascalCase', () => {
      const { result } = bulkConvertTextCase('XMLParser', CASES.pascalcase.value, CASES.snakecase.value);
      expect(result).toBe('xml_parser');
    });

    it('should sanitize punctuation when converting to identifier cases', () => {
      const { result } = bulkConvertTextCase('hello @world! #test', CASES.lowercase.value, CASES.snakecase.value);
      expect(result).toBe('hello_world_test');
    });

    it('should throw an error on unsupported fromCase or toCase (exhaustiveCheck)', () => {
      expect(() =>
        bulkConvertTextCase('hello', 'unsupported' as never, CASES.lowercase.value)
      ).toThrow('Unexpected case: unsupported');

      expect(() =>
        bulkConvertTextCase('hello', CASES.lowercase.value, 'unsupported' as never)
      ).toThrow('Unexpected case: unsupported');
    });
  });
});
