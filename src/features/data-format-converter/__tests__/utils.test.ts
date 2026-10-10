import { describe, it, expect, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import sampleData from '../sample-data.json';
import { DATA_FORMATS, FORMAT_MODES, convertDataFormat } from '../utils';

describe('data-format-converter utils', () => {
  describe('DATA_FORMATS and FORMAT_MODES constants', () => {
    it('should define all supported data formats with expected metadata', () => {
      expect(DATA_FORMATS.json.value).toBe('json');
      expect(DATA_FORMATS.json.label).toBe('JSON');
      expect(DATA_FORMATS.json.incompatibleWith).toEqual([]);

      expect(DATA_FORMATS.yaml.value).toBe('yaml');
      expect(DATA_FORMATS.toml.value).toBe('toml');
      expect(DATA_FORMATS.toml.incompatibleWith).toEqual(['csv', 'ini']);

      expect(DATA_FORMATS.xml.value).toBe('xml');
      expect(DATA_FORMATS.xml.incompatibleWith).toEqual(['csv', 'ini']);

      expect(DATA_FORMATS.csv.value).toBe('csv');
      expect(DATA_FORMATS.ini.value).toBe('ini');
    });

    it('should have minify and pretty format modes', () => {
      expect(FORMAT_MODES.minify).toBe('minify');
      expect(FORMAT_MODES.pretty).toBe('pretty');
    });
  });

  describe('convertDataFormat - empty / whitespace inputs', () => {
    it('should return empty result for empty or whitespace-only input', async () => {
      expect(await convertDataFormat('', DATA_FORMATS.json.value, DATA_FORMATS.yaml.value, FORMAT_MODES.pretty, testT)).toEqual({
        result: '',
      });
      expect(
        await convertDataFormat('   \n  ', DATA_FORMATS.json.value, DATA_FORMATS.yaml.value, FORMAT_MODES.pretty, testT)
      ).toEqual({
        result: '',
      });
    });
  });

  describe('convertDataFormat - parsing (fromType)', () => {
    it('should parse valid JSON and convert to YAML', async () => {
      const { result, error } = await convertDataFormat(
        sampleData.jsonObject,
        DATA_FORMATS.json.value,
        DATA_FORMATS.yaml.value,
        FORMAT_MODES.pretty,
        testT
      );
      expect(error).toBeUndefined();
      expect(result).toContain('user:');
      expect(result).toContain('alice_wonder');
    });

    it('should return parse error for invalid JSON', async () => {
      const { result, error } = await convertDataFormat(
        '{ bad json }',
        DATA_FORMATS.json.value,
        DATA_FORMATS.yaml.value,
        FORMAT_MODES.pretty,
        testT
      );
      expect(result).toBe('');
      expect(error).toBeDefined();
    });

    it('should parse valid YAML and convert to JSON', async () => {
      const yamlInput = 'user:\n  name: Alice\n  age: 30\n';
      const { result, error } = await convertDataFormat(
        yamlInput,
        DATA_FORMATS.yaml.value,
        DATA_FORMATS.json.value,
        FORMAT_MODES.minify,
        testT
      );
      expect(error).toBeUndefined();
      expect(JSON.parse(result)).toEqual({ user: { name: 'Alice', age: 30 } });
    });

    it('should return parse error for invalid YAML', async () => {
      const { result, error } = await convertDataFormat(
        'foo: [unclosed array',
        DATA_FORMATS.yaml.value,
        DATA_FORMATS.json.value,
        FORMAT_MODES.pretty,
        testT
      );
      expect(result).toBe('');
      expect(error).toBeDefined();
    });

    it('should parse valid TOML and convert to JSON', async () => {
      const tomlInput = 'title = "TOML Spec"\n[server]\nhost = "127.0.0.1"\nport = 8080';
      const { result, error } = await convertDataFormat(
        tomlInput,
        DATA_FORMATS.toml.value,
        DATA_FORMATS.json.value,
        FORMAT_MODES.minify,
        testT
      );
      expect(error).toBeUndefined();
      expect(JSON.parse(result)).toEqual({
        title: 'TOML Spec',
        server: { host: '127.0.0.1', port: 8080 },
      });
    });

    it('should return parse error for invalid TOML', async () => {
      const { result, error } = await convertDataFormat(
        'key = = invalid',
        DATA_FORMATS.toml.value,
        DATA_FORMATS.json.value,
        FORMAT_MODES.pretty,
        testT
      );
      expect(result).toBe('');
      expect(error).toBeDefined();
    });

    it('should parse valid XML and convert to JSON', async () => {
      const xmlInput = '<root><user id="1"><name>Bob</name></user></root>';
      const { result, error } = await convertDataFormat(
        xmlInput,
        DATA_FORMATS.xml.value,
        DATA_FORMATS.json.value,
        FORMAT_MODES.minify,
        testT
      );
      expect(error).toBeUndefined();
      expect(result).toContain('Bob');
    });

    it('should return parse error for invalid XML', async () => {
      const { result, error } = await convertDataFormat(
        '<unclosed><tag>',
        DATA_FORMATS.xml.value,
        DATA_FORMATS.json.value,
        FORMAT_MODES.pretty,
        testT
      );
      expect(result).toBe('');
      expect(error).toBeDefined();
    });

    it('should parse valid CSV using sample data and convert to JSON', async () => {
      const { result, error } = await convertDataFormat(
        sampleData.csvString,
        DATA_FORMATS.csv.value,
        DATA_FORMATS.json.value,
        FORMAT_MODES.pretty,
        testT
      );
      expect(error).toBeUndefined();
      const parsed = JSON.parse(result);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0].username).toBe('alice_wonder');
      expect(parsed[1].username).toBe('bob_builder');
    });

    it('should parse valid INI and convert to JSON', async () => {
      const iniInput = 'database=postgres\nport=5432\nenabled=true';
      const { result, error } = await convertDataFormat(
        iniInput,
        DATA_FORMATS.ini.value,
        DATA_FORMATS.json.value,
        FORMAT_MODES.minify,
        testT
      );
      expect(error).toBeUndefined();
      expect(JSON.parse(result)).toEqual({
        database: 'postgres',
        port: '5432',
        enabled: true,
      });
    });

    it('should trigger exhaustiveCheck for unsupported source format', async () => {
      const { result, error } = await convertDataFormat(
        'data',
        'unsupported' as never,
        DATA_FORMATS.json.value,
        FORMAT_MODES.pretty,
        testT
      );
      expect(result).toBe('');
      expect(error).toBe('Unexpected case: unsupported');
    });

    it('should handle non-Error throwables during parsing with fallback message', async () => {
      const spy = vi.spyOn(JSON, 'parse').mockImplementationOnce(() => {
        throw 'String thrown';
      });

      const { result, error } = await convertDataFormat(
        '{"a":1}',
        DATA_FORMATS.json.value,
        DATA_FORMATS.yaml.value,
        FORMAT_MODES.pretty,
        testT
      );
      expect(result).toBe('');
      expect(error).toBe(testT('dataFormatConverter.parseError'));

      spy.mockRestore();
    });
  });

  describe('convertDataFormat - serialization (toType)', () => {
    describe('JSON serialization', () => {
      it('should format JSON pretty with 2-space indentation', async () => {
        const { result } = await convertDataFormat(
          '{"a":1,"b":2}',
          DATA_FORMATS.json.value,
          DATA_FORMATS.json.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
      });

      it('should format JSON minified with no extra whitespace', async () => {
        const { result } = await convertDataFormat(
          '{\n  "a": 1,\n  "b": 2\n}',
          DATA_FORMATS.json.value,
          DATA_FORMATS.json.value,
          FORMAT_MODES.minify,
          testT
        );
        expect(result).toBe('{"a":1,"b":2}');
      });
    });

    describe('TOML serialization', () => {
      it('should serialize object to TOML', async () => {
        const jsonInput = '{"title": "Test", "owner": {"name": "Alice"}}';
        const { result, error } = await convertDataFormat(
          jsonInput,
          DATA_FORMATS.json.value,
          DATA_FORMATS.toml.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(error).toBeUndefined();
        expect(result).toContain('title = "Test"');
        expect(result).toContain('[owner]');
      });

      it('should wrap top-level array in root object for TOML', async () => {
        const jsonInput = '[{"id": 1}, {"id": 2}]';
        const { result, error } = await convertDataFormat(
          jsonInput,
          DATA_FORMATS.json.value,
          DATA_FORMATS.toml.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(error).toBeUndefined();
        expect(result).toContain('[[root]]');
      });

      it('should return error when serializing primitive or null to TOML', async () => {
        const { result: r1, error: e1 } = await convertDataFormat(
          '"plain string"',
          DATA_FORMATS.json.value,
          DATA_FORMATS.toml.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(r1).toBe('');
        expect(e1).toBe(testT('dataFormatConverter.invalidTomlData'));

        const { result: r2, error: e2 } = await convertDataFormat(
          'null',
          DATA_FORMATS.json.value,
          DATA_FORMATS.toml.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(r2).toBe('');
        expect(e2).toBe(testT('dataFormatConverter.invalidTomlData'));
      });
    });

    describe('XML serialization', () => {
      it('should serialize object with single top-level key as root', async () => {
        const { result, error } = await convertDataFormat(
          sampleData.jsonObject,
          DATA_FORMATS.json.value,
          DATA_FORMATS.xml.value,
          FORMAT_MODES.minify,
          testT
        );
        expect(error).toBeUndefined();
        expect(result).toMatch(/^<user>/);
        expect(result).toContain('alice_wonder');
      });

      it('should wrap multiple top-level keys in <root> element', async () => {
        const multiKeyJson = '{"first": "Alice", "last": "Wonder"}';
        const { result, error } = await convertDataFormat(
          multiKeyJson,
          DATA_FORMATS.json.value,
          DATA_FORMATS.xml.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(error).toBeUndefined();
        expect(result).toContain('<root>');
        expect(result).toContain('<first>Alice</first>');
      });

      it('should return error when serializing primitive or null to XML', async () => {
        const { result, error } = await convertDataFormat(
          '12345',
          DATA_FORMATS.json.value,
          DATA_FORMATS.xml.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(result).toBe('');
        expect(error).toBe(testT('dataFormatConverter.invalidXmlData'));
      });
    });

    describe('CSV serialization', () => {
      it('should serialize array of objects to CSV with header row', async () => {
        const arrayJson = '[{"id":"1","name":"Alice"},{"id":"2","name":"Bob"}]';
        const { result, error } = await convertDataFormat(
          arrayJson,
          DATA_FORMATS.json.value,
          DATA_FORMATS.csv.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(error).toBeUndefined();
        expect(result).toContain('id,name');
        expect(result).toContain('1,Alice');
        expect(result).toContain('2,Bob');
      });

      it('should return error when data is not CSV compatible (object instead of array)', async () => {
        const { result, error } = await convertDataFormat(
          '{"single": "object"}',
          DATA_FORMATS.json.value,
          DATA_FORMATS.csv.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(result).toBe('');
        expect(error).toBe(testT('dataFormatConverter.invalidCsvData'));
      });

      it('should return error when array contains primitives, null, or nested arrays', async () => {
        const { error: ePrimitives } = await convertDataFormat(
          '["str1", "str2"]',
          DATA_FORMATS.json.value,
          DATA_FORMATS.csv.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(ePrimitives).toBe(testT('dataFormatConverter.invalidCsvData'));

        const { error: eNull } = await convertDataFormat(
          '[{"a": 1}, null]',
          DATA_FORMATS.json.value,
          DATA_FORMATS.csv.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(eNull).toBe(testT('dataFormatConverter.invalidCsvData'));

        const { error: eArrays } = await convertDataFormat(
          '[[1, 2], [3, 4]]',
          DATA_FORMATS.json.value,
          DATA_FORMATS.csv.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(eArrays).toBe(testT('dataFormatConverter.invalidCsvData'));
      });
    });

    describe('INI serialization', () => {
      it('should serialize flat object to INI format', async () => {
        const flatJson = '{"host": "localhost", "port": 8080, "ssl": true}';
        const { result, error } = await convertDataFormat(
          flatJson,
          DATA_FORMATS.json.value,
          DATA_FORMATS.ini.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(error).toBeUndefined();
        expect(result).toContain('host=localhost');
        expect(result).toContain('port=8080');
      });

      it('should return error when data is not INI compatible (nested objects, arrays, primitives)', async () => {
        const { error: eNested } = await convertDataFormat(
          '{"section": {"nested": "value"}}',
          DATA_FORMATS.json.value,
          DATA_FORMATS.ini.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(eNested).toBe(testT('dataFormatConverter.invalidIniData'));

        const { error: eArray } = await convertDataFormat(
          '[1, 2, 3]',
          DATA_FORMATS.json.value,
          DATA_FORMATS.ini.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(eArray).toBe(testT('dataFormatConverter.invalidIniData'));

        const { error: ePrimitive } = await convertDataFormat(
          '"string"',
          DATA_FORMATS.json.value,
          DATA_FORMATS.ini.value,
          FORMAT_MODES.pretty,
          testT
        );
        expect(ePrimitive).toBe(testT('dataFormatConverter.invalidIniData'));
      });
    });

    it('should trigger exhaustiveCheck for unsupported target format', async () => {
      const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});

      const { result, error } = await convertDataFormat(
        '{"a": 1}',
        DATA_FORMATS.json.value,
        'unsupported' as never,
        FORMAT_MODES.pretty,
        testT
      );
      expect(result).toBe('');
      expect(error).toBe('Unexpected case: unsupported');

      traceSpy.mockRestore();
    });

    it('should handle non-Error throwables during serialization with fallback message', async () => {
      const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});
      const stringifySpy = vi.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
        throw 'String error during serialize';
      });

      const { result, error } = await convertDataFormat(
        '{"a": 1}',
        DATA_FORMATS.json.value,
        DATA_FORMATS.json.value,
        FORMAT_MODES.pretty,
        testT
      );
      expect(result).toBe('');
      expect(error).toBe(testT('dataFormatConverter.serializeError'));

      stringifySpy.mockRestore();
      traceSpy.mockRestore();
    });
  });
});
