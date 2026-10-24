import { describe, expect, it, vi } from 'vitest';

import {
  buildFlagsString,
  buildReplacementSegments,
  DEFAULT_FLAGS,
  executeRegex,
  expandReplacement,
  extractMatchGroups,
  formatMatchForDisplay,
  highlightSegments,
  isWhitespaceOnlyMatch,
  REGEX_PRESETS,
  validateRegex,
} from '../utils';

describe('regex-tester utils', () => {
  describe('buildFlagsString', () => {
    it('should build flag strings accurately including unicode and sticky', () => {
      expect(buildFlagsString(DEFAULT_FLAGS)).toBe('g');
      expect(
        buildFlagsString({
          global: true,
          caseInsensitive: true,
          multiline: true,
          dotAll: true,
          unicode: true,
          sticky: false,
        })
      ).toBe('gimsu');
      expect(
        buildFlagsString({
          global: true,
          caseInsensitive: true,
          multiline: true,
          dotAll: true,
          unicode: true,
          sticky: true,
        })
      ).toBe('imsuy');
      expect(
        buildFlagsString({
          global: false,
          caseInsensitive: false,
          multiline: false,
          dotAll: false,
          unicode: false,
          sticky: false,
        })
      ).toBe('');
    });
  });

  describe('validateRegex', () => {
    it('should return isValid true for empty pattern', () => {
      expect(validateRegex('', 'g')).toEqual({ isValid: true });
    });

    it('should return isValid true for valid pattern', () => {
      expect(validateRegex('^[a-z]+$', 'i')).toEqual({ isValid: true });
    });

    it('should return isValid false with error message for invalid syntax', () => {
      const result = validateRegex('[a-z', 'g');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return isValid false with default error message when compilation throws non-Error', () => {
      const originalRegExp = global.RegExp;
      function MockRegExp() {
        throw 'String error';
      }
      global.RegExp = MockRegExp as unknown as RegExpConstructor;
      try {
        const result = validateRegex('foo', 'g');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid regular expression');
      } finally {
        global.RegExp = originalRegExp;
      }
    });
  });

  describe('executeRegex', () => {
    it('should return empty matches when pattern or testText is empty', () => {
      expect(executeRegex('', 'g', 'sample')).toEqual({
        isValid: true,
        error: undefined,
        matches: [],
        replacedText: 'sample',
        replacementSegments: [],
      });
      expect(executeRegex('abc', 'g', '')).toEqual({
        isValid: true,
        error: undefined,
        matches: [],
        replacedText: '',
        replacementSegments: [],
      });
    });

    it('should return error when regex pattern is invalid', () => {
      const result = executeRegex('*abc', 'g', 'abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.matches).toHaveLength(0);
    });

    it('should find global matches with positions', () => {
      const text = 'foo bar foo baz foo';
      const result = executeRegex('foo', 'g', text);

      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(3);
      expect(result.matches[0]).toEqual({
        match: 'foo',
        index: 0,
        end: 3,
        groups: [],
      });
    });

    it('should find single match when global flag is not set', () => {
      const text = 'foo bar foo';
      const result = executeRegex('foo', '', text);

      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].index).toBe(0);
    });

    it('should extract numbered and named capture groups', () => {
      const text = '2026-10-16';
      const result = executeRegex('(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})', 'g', text);

      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(1);

      const groups = result.matches[0].groups;
      expect(groups).toHaveLength(3);
      expect(groups[0]).toEqual({ name: 'year', index: 1, value: '2026' });
      expect(groups[1]).toEqual({ name: 'month', index: 2, value: '10' });
      expect(groups[2]).toEqual({ name: 'day', index: 3, value: '16' });
    });

    it('should support case-insensitive and multiline flags', () => {
      const text = 'hello\nHELLO\nworld';
      const result = executeRegex('^hello', 'gim', text);

      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(2);
    });

    it('should execute every preset against its sample text', () => {
      REGEX_PRESETS.forEach((preset) => {
        const flags = buildFlagsString(preset.flags);
        const result = executeRegex(preset.pattern, flags, preset.sampleText);
        expect(result.isValid).toBe(true);
        expect(result.matches.length).toBeGreaterThan(0);
      });
    });

    describe('REGEX_PRESETS pattern edge cases', () => {
      const getPreset = (id: string) => {
        const preset = REGEX_PRESETS.find((p) => p.id === id);
        if (!preset) {
          throw new Error(`Preset ${id} not found`);
        }
        return preset;
      };

      const runPreset = (id: string, text: string) => {
        const preset = getPreset(id);
        return executeRegex(preset.pattern, buildFlagsString(preset.flags), text);
      };

      describe('phone preset', () => {
        it('should match valid domestic and international phone numbers', () => {
          const valids = [
            '(555) 123-4567',
            '+1-800-555-0199',
            '415-555-2671',
            '+44 20 7946 0958',
            '+91 98765 43210',
            '+81 3 5555 0143',
            '+61 2 9876 5432',
            '+1 (888) 456-7890',
          ];
          valids.forEach((num) => {
            const res = runPreset('phone', num);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
            expect(res.matches[0].match).toBe(num);
          });
        });

        it('should reject digit strings without separators, short codes, and plain ranges', () => {
          const invalids = [
            'order #8841928472910',
            'serial 123456789012',
            'ID 1234',
            'code 99',
            'zip 94105',
            'pages 1-500',
            'ratio 2 - 300',
          ];
          invalids.forEach((text) => {
            const res = runPreset('phone', text);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });
      });

      describe('quoted-string preset', () => {
        it('should match double and single quoted strings, including empty and escaped quotes', () => {
          const valids = [
            '"Sample Application"',
            "'2.5.0'",
            '"Hello, world! Welcome."',
            "'https://example.com'",
            '""',
            "''",
            '"escaped \\"quotes\\""',
          ];
          valids.forEach((str) => {
            const res = runPreset('quoted-string', str);
            expect(res.isValid).toBe(true);
            expect(res.matches.length).toBeGreaterThan(0);
            expect(res.matches[0].match).toBe(str);
          });
        });

        it('should not match unquoted keywords or identifiers', () => {
          const text = 'const port = 3000;\nreturn false;';
          const res = runPreset('quoted-string', text);
          expect(res.isValid).toBe(true);
          expect(res.matches).toHaveLength(0);
        });
      });

      describe('hashtag preset', () => {
        it('should match hashtags starting with letters or underscore', () => {
          const valids = ['#webdev', '#frontend', '#web3', '#coding2026', '#_private'];
          valids.forEach((tag) => {
            const res = runPreset('hashtag', tag);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
            expect(res.matches[0].match).toBe(tag);
          });
        });

        it('should reject digit-first numbers and isolated hashes', () => {
          const invalids = ['Issue #42', 'PR #108', 'item #5', '#', '## subhead'];
          invalids.forEach((text) => {
            const res = runPreset('hashtag', text);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });
      });

      describe('number preset', () => {
        it('should match integers, signed numbers, and decimals', () => {
          const valids = ['42', '-17', '+8', '3.14159', '-12.5', '0.75'];
          valids.forEach((num) => {
            const res = runPreset('number', num);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
            expect(res.matches[0].match).toBe(num);
          });
        });

        it('should reject numbers attached to identifiers and chained dots', () => {
          const invalids = ['item42', 'value99', 'v2.1.0', '1.2.3'];
          invalids.forEach((text) => {
            const res = runPreset('number', text);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });
      });

      describe('decimal-number preset', () => {
        it('should match valid decimal numbers', () => {
          const valids = ['3.14159', '142.75', '23.6', '0.5'];
          valids.forEach((num) => {
            const res = runPreset('decimal-number', num);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
            expect(res.matches[0].match).toBe(num);
          });
        });

        it('should reject whole integers, chained dots (versions), and trailing/leading dots', () => {
          const invalids = ['42', '100', 'v2.1.0', '18.12.1', '3.0.0-beta', '10.', '.5'];
          invalids.forEach((text) => {
            const res = runPreset('decimal-number', text);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });
      });

      describe('ipv4 preset', () => {
        it('should match valid IPv4 addresses', () => {
          const valids = ['127.0.0.1', '192.168.1.1', '8.8.8.8', '0.0.0.0', '255.255.255.255'];
          valids.forEach((ip) => {
            const res = runPreset('ipv4', ip);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
            expect(res.matches[0].match).toBe(ip);
          });
        });

        it('should reject out-of-range octets and incomplete segments', () => {
          const invalids = ['256.0.0.1', '999.1.1.1', '192.168.300.5', '192.168.1', '10.0..1', '172.16.0.'];
          invalids.forEach((ip) => {
            const res = runPreset('ipv4', ip);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });
      });

      describe('date-iso preset', () => {
        it('should match valid ISO format dates', () => {
          const valids = ['2024-01-15', '2026-10-16', '1999-12-31'];
          valids.forEach((date) => {
            const res = runPreset('date-iso', date);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
            expect(res.matches[0].match).toBe(date);
          });
        });

        it('should reject invalid month/day values and non-ISO formats', () => {
          const invalids = [
            '2025-13-01',
            '2024-00-15',
            '2024-02-32',
            '2026-05-00',
            '10/16/2026',
            '16-10-2026',
            '2026.10.16',
            '2024-05',
          ];
          invalids.forEach((date) => {
            const res = runPreset('date-iso', date);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });
      });

      describe('time-12h and time-24h presets', () => {
        it('should match valid 12-hour times and reject 24h formats or invalid values', () => {
          const valids = ['08:30 AM', '9:15 am', '12:00 PM', '11:59 pm', '12:00 AM'];
          valids.forEach((time) => {
            const res = runPreset('time-12h', time);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
          });

          const invalids = ['14:30', '23:15', '13:00 PM', '00:30 AM', '11:65 AM'];
          invalids.forEach((time) => {
            const res = runPreset('time-12h', time);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });

        it('should match valid 24-hour times and reject invalid hours/minutes', () => {
          const valids = ['05:45', '12:00', '23:59', '00:00'];
          valids.forEach((time) => {
            const res = runPreset('time-24h', time);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
          });

          const invalids = ['24:00', '25:30', '12:60', '08:95', '8:30', '9:5'];
          invalids.forEach((time) => {
            const res = runPreset('time-24h', time);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });
      });

      describe('uuid preset', () => {
        it('should match standard 36-char hex UUIDs', () => {
          const valids = ['c9bf9e57-1685-4c89-bafb-ff5af830be8a', '550E8400-E29B-41D4-A716-446655440000'];
          valids.forEach((uuid) => {
            const res = runPreset('uuid', uuid);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
          });
        });

        it('should reject truncated UUIDs, missing hyphens, or non-hex characters', () => {
          const invalids = [
            'c9bf9e57-1685-4c89-bafb',
            'c9bf9e5716854c89bafbff5af830be8a',
            'g9bf9e57-1685-4c89-bafb-ff5af830be8a',
          ];
          invalids.forEach((uuid) => {
            const res = runPreset('uuid', uuid);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });
      });

      describe('html-tag preset', () => {
        it('should match paired tags and self-closing tags', () => {
          const valids = [
            '<h1 id="title">Sample Heading</h1>',
            '<span class="badge">v2.0</span>',
            '<img src="/image.png" alt="Preview" />',
            '<hr />',
          ];
          valids.forEach((tag) => {
            const res = runPreset('html-tag', tag);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(1);
          });
        });

        it('should reject mismatched tags, unclosed tags, and math comparisons', () => {
          const invalids = [
            '<div>Mismatched tag</span>',
            '<p>Unclosed paragraph element',
            'Math comparison: count < 5 or threshold > 10',
          ];
          invalids.forEach((html) => {
            const res = runPreset('html-tag', html);
            expect(res.isValid).toBe(true);
            expect(res.matches).toHaveLength(0);
          });
        });
      });
    });

    it('should filter out zero-length matches without hanging or infinite loop', () => {
      const text = 'a\nb\nc';
      const result = executeRegex('^', 'gm', text);
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(0);

      const partialResult = executeRegex('a*', 'g', 'ba');
      expect(partialResult.isValid).toBe(true);
      expect(partialResult.matches).toHaveLength(1);
      expect(partialResult.matches[0].match).toBe('a');
    });

    it('should correctly handle zero-length matches with Unicode characters without splitting surrogate pairs', () => {
      const text = '😀';
      // In Unicode mode, zero-length matches shouldn't hang or freeze
      const result = executeRegex('(?=.)', 'gu', text);
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(0);

      // Verify that after zero-length match on surrogate pair, it advances past the full code point
      const matchResult = executeRegex('a|b*', 'gu', '😀a');
      expect(matchResult.isValid).toBe(true);
      const matchedTexts = matchResult.matches.map((m) => m.match);
      expect(matchedTexts).toEqual(['a']);
      // 'a' is at index 2 (after the 2-unit surrogate pair '😀')
      expect(matchResult.matches[0].index).toBe(2);
    });

    describe('quirky regex and runtime edge cases', () => {
      it('should handle lone/unpaired surrogates with zero-length match without over-stepping', () => {
        // \uD83D is a high surrogate without a trailing low surrogate
        const loneSurrogateText = '\uD83Da';
        const result = executeRegex('a|b*', 'gu', loneSurrogateText);
        expect(result.isValid).toBe(true);
        expect(result.matches).toHaveLength(1);
        expect(result.matches[0].match).toBe('a');
        expect(result.matches[0].index).toBe(1);
      });

      it('should match Unicode property escapes correctly with u flag', () => {
        const text = 'Hello Привет 123 🚀 🌟';
        const letterResult = executeRegex('\\p{L}+', 'gu', text);
        expect(letterResult.isValid).toBe(true);
        expect(letterResult.matches.map((m) => m.match)).toEqual(['Hello', 'Привет']);

        const emojiResult = executeRegex('\\p{Extended_Pictographic}+', 'gu', text);
        expect(emojiResult.isValid).toBe(true);
        expect(emojiResult.matches.map((m) => m.match)).toEqual(['🚀', '🌟']);
      });

      it('should handle CRLF line endings with multiline flag', () => {
        const text = 'line1\r\nline2\r\nline3';
        const result = executeRegex('^line\\d', 'gm', text);
        expect(result.isValid).toBe(true);
        expect(result.matches).toHaveLength(3);
        expect(result.matches.map((m) => m.match)).toEqual(['line1', 'line2', 'line3']);
      });

      it('should support positive and negative lookbehind assertions', () => {
        const text = 'order: 100, item: $250, count: 50';
        const priceResult = executeRegex('(?<=\\$)\\d+', 'g', text);
        expect(priceResult.isValid).toBe(true);
        expect(priceResult.matches).toHaveLength(1);
        expect(priceResult.matches[0].match).toBe('250');

        const nonPriceResult = executeRegex('(?<!\\$)\\b\\d+\\b', 'g', text);
        expect(nonPriceResult.isValid).toBe(true);
        expect(nonPriceResult.matches.map((m) => m.match)).toEqual(['100', '50']);
      });

      it('should handle empty lines matching ^$ under gm flags without hanging', () => {
        const text = 'first\n\nmiddle\n\n\nlast';
        const result = executeRegex('^$', 'gm', text);
        expect(result.isValid).toBe(true);
        // Empty zero-length matches are filtered from display matches
        expect(result.matches).toHaveLength(0);
      });

      it('should handle named capture groups across alternation branches', () => {
        const text = 'id: 42 or code: abc';
        const result = executeRegex('(?<num>\\d+)|(?<word>[a-z]+)', 'g', text);
        expect(result.isValid).toBe(true);
        expect(result.matches.length).toBeGreaterThanOrEqual(2);
        // First match is 'id' from branch 2 ([a-z]+)
        expect(result.matches[0].match).toBe('id');
        expect(result.matches[0].groups).toEqual([{ name: 'word', index: 2, value: 'id' }]);
        // Second match is '42' from branch 1 (\\d+)
        expect(result.matches[1].match).toBe('42');
        expect(result.matches[1].groups).toEqual([{ name: 'num', index: 1, value: '42' }]);
      });
    });

    it('should extract numbered and named capture groups for non-global regex', () => {
      const text = 'user: alice id: 42';
      const result = executeRegex('(?<name>[a-z]+) id: (\\d+)', '', text);

      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].groups).toHaveLength(2);
      expect(result.matches[0].groups[0]).toEqual({ name: 'name', index: 1, value: 'alice' });
      expect(result.matches[0].groups[1]).toEqual({ name: undefined, index: 2, value: '42' });
    });

    it('should handle execution error gracefully when invalid flag is passed', () => {
      const result = executeRegex('foo', 'invalid_flags' as string, 'test text');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.matches).toEqual([]);
    });

    it('should handle Error exceptions during execution gracefully', () => {
      const originalExec = RegExp.prototype.exec;
      RegExp.prototype.exec = vi.fn().mockImplementation(() => {
        throw new Error('Execution failed');
      });

      try {
        const result = executeRegex('foo', 'g', 'test');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Execution failed');
      } finally {
        RegExp.prototype.exec = originalExec;
      }
    });

    it('should handle non-Error exceptions gracefully', () => {
      const originalExec = RegExp.prototype.exec;
      RegExp.prototype.exec = vi.fn().mockImplementation(() => {
        throw 'String error';
      });

      try {
        const result = executeRegex('foo', 'g', 'test');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Execution error');
      } finally {
        RegExp.prototype.exec = originalExec;
      }
    });

    it('should handle non-Error compilation exceptions gracefully in executeRegex', () => {
      const originalRegExp = global.RegExp;
      function MockRegExp() {
        throw 'Compilation string error';
      }
      global.RegExp = MockRegExp as unknown as RegExpConstructor;
      try {
        const result = executeRegex('foo', 'g', 'test');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid regular expression');
      } finally {
        global.RegExp = originalRegExp;
      }
    });

    it('should support sticky flag in executeRegex', () => {
      const result = executeRegex('foo', 'y', 'foobar');
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].match).toBe('foo');
    });

    it('should stop matching and set isCapped when maxMatches limit is reached', () => {
      const result = executeRegex('a', 'g', 'aaaaa', 2);
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(2);
      expect(result.isCapped).toBe(true);

      const uncappedResult = executeRegex('a', 'g', 'aa', 5);
      expect(uncappedResult.isValid).toBe(true);
      expect(uncappedResult.matches).toHaveLength(2);
      expect(uncappedResult.isCapped).toBe(false);
    });

    it('should return empty matches when non-global regex has no match', () => {
      const result = executeRegex('xyz', '', 'abc');
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(0);
    });

    it('should handle undefined optional capture groups in global and non-global regex', () => {
      const globalResult = executeRegex('(a)|(b)', 'g', 'a');
      expect(globalResult.matches[0].groups).toHaveLength(1);
      expect(globalResult.matches[0].groups[0].value).toBe('a');

      const nonGlobalResult = executeRegex('(a)|(b)', '', 'a');
      expect(nonGlobalResult.matches[0].groups).toHaveLength(1);
      expect(nonGlobalResult.matches[0].groups[0].value).toBe('a');
    });
  });

  describe('executeRegex replacement', () => {
    it('should replace global matches using capture references', () => {
      const result = executeRegex('(\\w+)@(\\w+)', 'g', 'alice@example bob@test', 100, '$2:$1');

      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(2);
      expect(result.replacedText).toBe('example:alice test:bob');
    });

    it('should replace only the first match without the global flag', () => {
      const result = executeRegex('foo', '', 'foo foo', 100, 'bar');

      expect(result.replacedText).toBe('bar foo');
    });

    it('should support the $& and $$ replacement patterns', () => {
      const result = executeRegex('foo', 'g', 'foo', 100, '[$&] $$');

      expect(result.replacedText).toBe('[foo] $');
    });

    it('should remove matches when the replacement is empty', () => {
      const result = executeRegex('\\s+', 'g', 'a b\tc', 100, '');

      expect(result.matches).toHaveLength(2);
      expect(result.replacedText).toBe('abc');
      expect(result.replacementSegments).toEqual([
        { text: 'a', isReplacement: false },
        { text: '', isReplacement: true, matchIndex: 1 },
        { text: 'b', isReplacement: false },
        { text: '', isReplacement: true, matchIndex: 2 },
        { text: 'c', isReplacement: false },
      ]);
    });

    it('should remove a matched space with an empty replacement', () => {
      const result = executeRegex('\\s+', 'g', 'ab c', 100, '');

      expect(result.replacedText).toBe('abc');
      expect(result.replacementSegments).toEqual([
        { text: 'ab', isReplacement: false },
        { text: '', isReplacement: true, matchIndex: 1 },
        { text: 'c', isReplacement: false },
      ]);
    });

    it('should keep a matched space when replacing it with a space', () => {
      const result = executeRegex('\\s+', 'g', 'ab c', 100, ' ');

      expect(result.replacedText).toBe('ab c');
    });

    it('should leave the input unchanged when no replacement is provided', () => {
      const result = executeRegex('\\s+', 'g', 'a b\tc', 100);

      expect(result.replacedText).toBe('a b\tc');
      expect(result.replacementSegments).toEqual([]);
    });

    it('should apply sticky replacement semantics', () => {
      const result = executeRegex('foo', 'y', 'foofoo', 100, 'x');

      expect(result.replacedText).toBe('xfoo');
      expect(result.replacementSegments!.map((segment) => segment.text).join('')).toBe(result.replacedText);
    });

    it('should keep zero-length matches out of the match list but apply replacements', () => {
      const result = executeRegex('\\b', 'g', 'ab', 100, 'X');

      expect(result.matches).toEqual([]);
      expect(result.replacedText).toBe('XabX');
    });

    it('should ignore a zero-length non-global match', () => {
      const result = executeRegex('\\b', '', 'ab', 100, 'X');

      expect(result.matches).toEqual([]);
      expect(result.replacedText).toBe('Xab');
    });
  });

  describe('replacement preview segments', () => {
    it('should expand capture, named group, and full match tokens', () => {
      const match = new RegExp('(?<user>\\w+)@(\\w+)').exec('alice@example')!;

      expect(expandReplacement('$1:$2', match, 'alice@example')).toBe('alice:example');
      expect(expandReplacement('$<user>', match, 'alice@example')).toBe('alice');
      expect(expandReplacement('[$&]', match, 'alice@example')).toBe('[alice@example]');
      expect(expandReplacement('$$', match, 'alice@example')).toBe('$');
      expect(expandReplacement('$`', match, 'alice@example')).toBe('');
      expect(expandReplacement("$'", match, 'alice@example')).toBe('');
    });

    it('should keep unknown tokens literal and expand missing groups to empty strings', () => {
      const match = new RegExp('(?<user>a)(b)?').exec('a')!;

      expect(expandReplacement('$9', match, 'a')).toBe('$9');
      expect(expandReplacement('$0', match, 'a')).toBe('$0');
      expect(expandReplacement('$2', match, 'a')).toBe('');
      expect(expandReplacement('$<missing>', match, 'a')).toBe('');
      expect(expandReplacement('$<missing>', /a/.exec('a')!, 'a')).toBe('$<missing>');
    });

    it('should fall back to the first digit plus a literal for oversized group references', () => {
      const match = /(a)/.exec('a')!;

      expect(expandReplacement('$10', match, 'a')).toBe('a0');
      expect(expandReplacement('$10', /(a)?/.exec('')!, '')).toBe('0');
      expect(expandReplacement('$00', match, 'a')).toBe('$00');
    });

    it('should split replaced text into plain and replacement segments', () => {
      const segments = buildReplacementSegments('\\d+', 'g', 'a1b22c', '[$&]');

      expect(segments).toEqual([
        { text: 'a', isReplacement: false },
        { text: '[1]', isReplacement: true, matchIndex: 1 },
        { text: 'b', isReplacement: false },
        { text: '[22]', isReplacement: true, matchIndex: 2 },
        { text: 'c', isReplacement: false },
      ]);
    });

    it('should split removed matches into empty replacement segments and return plain text for invalid patterns', () => {
      expect(buildReplacementSegments('a', 'g', 'aba', '')).toEqual([
        { text: '', isReplacement: true, matchIndex: 1 },
        { text: 'b', isReplacement: false },
        { text: '', isReplacement: true, matchIndex: 2 },
      ]);
      expect(buildReplacementSegments('a', 'g', 'aba')).toEqual([{ text: 'aba', isReplacement: false }]);
      expect(buildReplacementSegments('[', 'g', 'aba', 'x')).toEqual([{ text: 'aba', isReplacement: false }]);
    });

    it('should handle zero-length matches and non-global replacements', () => {
      expect(buildReplacementSegments('\\b', 'g', 'ab', 'X')).toEqual([
        { text: 'X', isReplacement: true, matchIndex: 1 },
        { text: 'ab', isReplacement: false },
        { text: 'X', isReplacement: true, matchIndex: 2 },
      ]);

      expect(buildReplacementSegments('a', '', 'aba', 'X')).toEqual([
        { text: 'X', isReplacement: true, matchIndex: 1 },
        { text: 'ba', isReplacement: false },
      ]);
    });

    it('should advance by code point for unicode zero-length matches', () => {
      expect(buildReplacementSegments('(?=😀)', 'gu', '😀a', 'X')).toEqual([
        { text: 'X', isReplacement: true, matchIndex: 1 },
        { text: '😀a', isReplacement: false },
      ]);
    });

    it('should return no segments for empty input and undefined when the preview cap is exceeded', () => {
      expect(buildReplacementSegments('a', 'g', '', 'X')).toEqual([]);
      expect(buildReplacementSegments('a', 'g', 'a'.repeat(5001), 'X')).toBeUndefined();
    });

    it('should concatenate segments into the same output as native replacement', () => {
      const source = 'alice@example bob@test';
      const result = executeRegex('(\\w+)@(\\w+)', 'g', source, 100, '$2:$1');
      const concatenated = result.replacementSegments!.map((segment) => segment.text).join('');

      expect(concatenated).toBe(result.replacedText);
    });

    it('should omit preview segments when the preview cap is exceeded', () => {
      const result = executeRegex('a', 'g', 'a'.repeat(5001), 10, 'X');

      expect(result.replacementSegments).toEqual([]);
    });
  });

  describe('whitespace match helpers', () => {
    it('should detect whitespace-only matches', () => {
      expect(isWhitespaceOnlyMatch(' \t\n')).toBe(true);
      expect(isWhitespaceOnlyMatch('')).toBe(false);
      expect(isWhitespaceOnlyMatch(' a ')).toBe(false);
      expect(isWhitespaceOnlyMatch('abc')).toBe(false);
    });

    it('should render common whitespace characters as readable labels', () => {
      expect(formatMatchForDisplay(' \t\n\r\f\v\u00a0')).toBe(
        '[space][tab][newline][return][form feed][vertical tab][non-breaking space]'
      );
    });

    it('should render other whitespace and control characters as generic labels', () => {
      expect(formatMatchForDisplay('\u2003')).toBe('[whitespace]');
      expect(formatMatchForDisplay('\u0001')).toBe('[control]');
      expect(formatMatchForDisplay('\u007f')).toBe('[control]');
    });

    it('should leave ordinary text unchanged', () => {
      expect(formatMatchForDisplay('hello-world_123')).toBe('hello-world_123');
    });
  });

  describe('highlightSegments', () => {
    it('should return single non-matching segment if no matches', () => {
      const segments = highlightSegments('hello world', []);
      expect(segments).toEqual([{ text: 'hello world', isMatch: false }]);
    });

    it('should return empty array for empty testText', () => {
      expect(highlightSegments('', [])).toEqual([]);
    });

    it('should accurately segment matches and surrounding text including trailing text', () => {
      const text = 'apple banana cherry date';
      const matches = [
        { match: 'apple', index: 0, end: 5, groups: [] },
        { match: 'cherry', index: 13, end: 19, groups: [] },
      ];

      const segments = highlightSegments(text, matches);

      expect(segments).toEqual([
        { text: 'apple', isMatch: true, matchIndex: 1 },
        { text: ' banana ', isMatch: false },
        { text: 'cherry', isMatch: true, matchIndex: 2 },
        { text: ' date', isMatch: false },
      ]);
    });

    it('should ignore overlapping matches where match.index is less than currentIndex', () => {
      const text = 'testing';
      const matches = [
        { match: 'test', index: 0, end: 4, groups: [] },
        { match: 'est', index: 1, end: 4, groups: [] },
      ];

      const segments = highlightSegments(text, matches);
      expect(segments).toEqual([
        { text: 'test', isMatch: true, matchIndex: 1 },
        { text: 'ing', isMatch: false },
      ]);
    });

    it('should skip zero-length matches when segmenting', () => {
      const text = 'hello';
      const matches = [{ match: '', index: 0, end: 0, groups: [] }];
      const segments = highlightSegments(text, matches);
      expect(segments).toEqual([{ text: 'hello', isMatch: false }]);
    });
  });

  describe('extractMatchGroups', () => {
    it('should extract named and unnamed capture groups from RegExpExecArray', () => {
      const regex = new RegExp('(?<year>\\d{4})-(\\d{2})-(?<day>\\d{2})');
      const match = regex.exec('2026-10-17');
      expect(match).not.toBeNull();
      const groups = extractMatchGroups(match!);
      expect(groups).toEqual([
        { index: 1, name: 'year', value: '2026' },
        { index: 2, name: undefined, value: '10' },
        { index: 3, name: 'day', value: '17' },
      ]);
    });

    it('should handle regex without named groups', () => {
      const match = /(\d+)/.exec('123');
      expect(match).not.toBeNull();
      const groups = extractMatchGroups(match!);
      expect(groups).toEqual([{ index: 1, name: undefined, value: '123' }]);
    });

    it('should correctly attribute distinct named groups when values are identical', () => {
      const regex = new RegExp('(?<first>\\w+)-(?<second>\\w+)');
      const match = regex.exec('same-same');
      expect(match).not.toBeNull();
      const groups = extractMatchGroups(match!);
      expect(groups).toEqual([
        { index: 1, name: 'first', value: 'same' },
        { index: 2, name: 'second', value: 'same' },
      ]);
    });
    it('should correctly attribute named group when preceded by an unnamed group capturing the same value', () => {
      const regex = new RegExp('(\\w+) (?<named>\\w+)', 'd');
      const match = regex.exec('foo foo');
      expect(match).not.toBeNull();
      const groups = extractMatchGroups(match!);
      expect(groups).toEqual([
        { index: 1, name: undefined, value: 'foo' },
        { index: 2, name: 'named', value: 'foo' },
      ]);
    });

    it('should handle optional unmatched named capture groups when indices are present', () => {
      const regex = new RegExp('(?<first>a)|(?<second>b)', 'd');
      const match = regex.exec('a');
      expect(match).not.toBeNull();
      const groups = extractMatchGroups(match!);
      expect(groups).toEqual([{ index: 1, name: 'first', value: 'a' }]);
    });
  });

  describe('highlightSegments without trailing text', () => {
    it('should not add trailing non-match segment when match ends at text length', () => {
      const text = 'exact';
      const matches = [{ match: 'exact', index: 0, end: 5, groups: [] }];
      const segments = highlightSegments(text, matches);
      expect(segments).toEqual([{ text: 'exact', isMatch: true, matchIndex: 1 }]);
    });

    it('should handle zero-length matches at end or middle of text without duplicating content', () => {
      const text = 'hello';
      const endMatch = [{ match: '', index: 5, end: 5, groups: [] }];
      const segments = highlightSegments(text, endMatch);
      expect(segments).toEqual([{ text: 'hello', isMatch: false }]);

      const wordBoundaries = [
        { match: '', index: 0, end: 0, groups: [] },
        { match: '', index: 5, end: 5, groups: [] },
      ];
      const wbSegments = highlightSegments(text, wordBoundaries);
      expect(wbSegments).toEqual([{ text: 'hello', isMatch: false }]);
    });
  });
});
