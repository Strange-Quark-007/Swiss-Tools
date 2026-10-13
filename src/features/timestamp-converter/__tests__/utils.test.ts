import { describe, it, expect, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import {
  bulkConvertTimestamps,
  convertTimestamp,
  formatTimestamp,
  getRelativeTimeString,
  getSampleTimestamp,
  parseTimestamp,
  TIMESTAMP_FORMATS,
} from '../utils';

describe('timestamp-converter utils', () => {
  const FIXED_BASE_TIME = 1718000000000; // 2024-06-10T06:13:20.000Z
  const FIXED_DATE = new Date(FIXED_BASE_TIME);

  describe('parseTimestamp', () => {
    it('should return null for empty or whitespace-only inputs', () => {
      expect(parseTimestamp('', TIMESTAMP_FORMATS.unixSec.value)).toBeNull();
      expect(parseTimestamp('   ', TIMESTAMP_FORMATS.iso8601.value)).toBeNull();
    });

    it('should parse unixSec accurately', () => {
      const parsed = parseTimestamp('1718000000', TIMESTAMP_FORMATS.unixSec.value);
      expect(parsed?.getTime()).toBe(FIXED_BASE_TIME);
    });

    it('should parse unixMilli accurately', () => {
      const parsed = parseTimestamp('1718000000000', TIMESTAMP_FORMATS.unixMilli.value);
      expect(parsed?.getTime()).toBe(FIXED_BASE_TIME);
    });

    it('should return null for invalid numeric timestamps', () => {
      expect(parseTimestamp('not-a-number', TIMESTAMP_FORMATS.unixSec.value)).toBeNull();
      expect(parseTimestamp('invalid', TIMESTAMP_FORMATS.unixMilli.value)).toBeNull();
    });

    it('should parse iso8601 accurately', () => {
      const parsed = parseTimestamp('2024-06-10T06:13:20.000Z', TIMESTAMP_FORMATS.iso8601.value);
      expect(parsed?.getTime()).toBe(FIXED_BASE_TIME);
      expect(parseTimestamp('invalid-iso', TIMESTAMP_FORMATS.iso8601.value)).toBeNull();
    });

    it('should parse utc string accurately', () => {
      const parsed = parseTimestamp('Mon, 10 Jun 2024 06:13:20 GMT', TIMESTAMP_FORMATS.utc.value);
      expect(parsed?.getTime()).toBe(FIXED_BASE_TIME);
    });

    it('should parse sql datetime accurately', () => {
      const parsed = parseTimestamp('2024-06-10 06:13:20', TIMESTAMP_FORMATS.sql.value);
      expect(parsed?.getTime()).toBe(FIXED_BASE_TIME);
    });

    it('should parse dateIso accurately', () => {
      const parsed = parseTimestamp('2024-06-10', TIMESTAMP_FORMATS.dateIso.value);
      expect(parsed?.toISOString().startsWith('2024-06-10')).toBe(true);
    });

    it('should parse dateDmy accurately with slash or hyphen', () => {
      const parsedSlash = parseTimestamp('10/06/2024', TIMESTAMP_FORMATS.dateDmy.value);
      expect(parsedSlash?.toISOString().startsWith('2024-06-10')).toBe(true);
      const parsedHyphen = parseTimestamp('10-06-2024', TIMESTAMP_FORMATS.dateDmy.value);
      expect(parsedHyphen?.toISOString().startsWith('2024-06-10')).toBe(true);
    });

    it('should parse dateMdy accurately with slash or hyphen', () => {
      const parsedSlash = parseTimestamp('06/10/2024', TIMESTAMP_FORMATS.dateMdy.value);
      expect(parsedSlash?.toISOString().startsWith('2024-06-10')).toBe(true);
      const parsedHyphen = parseTimestamp('06-10-2024', TIMESTAMP_FORMATS.dateMdy.value);
      expect(parsedHyphen?.toISOString().startsWith('2024-06-10')).toBe(true);
    });

    it('should parse date formats with fallback when regex does not match', () => {
      const fallbackIso = parseTimestamp('2024-06-10T06:13:20Z', TIMESTAMP_FORMATS.dateIso.value);
      expect(fallbackIso?.getTime()).toBe(FIXED_BASE_TIME);

      const fallbackDmy = parseTimestamp('2024-06-10T06:13:20Z', TIMESTAMP_FORMATS.dateDmy.value);
      expect(fallbackDmy?.getTime()).toBe(FIXED_BASE_TIME);

      const fallbackMdy = parseTimestamp('2024-06-10T06:13:20Z', TIMESTAMP_FORMATS.dateMdy.value);
      expect(fallbackMdy?.getTime()).toBe(FIXED_BASE_TIME);
    });

    it('should parse time24h accurately', () => {
      const parsed = parseTimestamp('06:13:20', TIMESTAMP_FORMATS.time24h.value, FIXED_BASE_TIME);
      expect(parsed?.getUTCHours()).toBe(6);
      expect(parsed?.getUTCMinutes()).toBe(13);
      expect(parsed?.getUTCSeconds()).toBe(20);
    });

    it('should parse time12h accurately', () => {
      const parsedAm = parseTimestamp('06:13:20 AM', TIMESTAMP_FORMATS.time12h.value, FIXED_BASE_TIME);
      expect(parsedAm?.getUTCHours()).toBe(6);
      expect(parsedAm?.getUTCMinutes()).toBe(13);

      const parsedPm = parseTimestamp('06:13:20 PM', TIMESTAMP_FORMATS.time12h.value, FIXED_BASE_TIME);
      expect(parsedPm?.getUTCHours()).toBe(18);
      expect(parsedPm?.getUTCMinutes()).toBe(13);
    });

    it('should parse relative strings', () => {
      const nowParsed = parseTimestamp('now', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(nowParsed?.getTime()).toBe(FIXED_BASE_TIME);

      const yesterdayParsed = parseTimestamp('yesterday', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(yesterdayParsed?.getTime()).toBe(FIXED_BASE_TIME - 86400000);

      const tomorrowParsed = parseTimestamp('tomorrow', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(tomorrowParsed?.getTime()).toBe(FIXED_BASE_TIME + 86400000);

      const agoParsed = parseTimestamp('2 hours ago', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(agoParsed?.getTime()).toBe(FIXED_BASE_TIME - 2 * 3600000);

      const inParsed = parseTimestamp('in 3 days', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(inParsed?.getTime()).toBe(FIXED_BASE_TIME + 3 * 86400000);
    });

    it('should parse sql datetime with milliseconds or fallback', () => {
      const parsedWithMs = parseTimestamp('2024-06-10 06:13:20.123', TIMESTAMP_FORMATS.sql.value);
      expect(parsedWithMs?.getUTCMilliseconds()).toBe(123);

      const parsedFallback = parseTimestamp('2024-06-10T06:13:20Z', TIMESTAMP_FORMATS.sql.value);
      expect(parsedFallback?.getTime()).toBe(FIXED_BASE_TIME);

      const parsedInvalid = parseTimestamp('not a sql date', TIMESTAMP_FORMATS.sql.value);
      expect(parsedInvalid).toBeNull();
    });

    it('should return null for invalid date and time formats', () => {
      expect(parseTimestamp('invalid-date', TIMESTAMP_FORMATS.dateIso.value)).toBeNull();
      expect(parseTimestamp('invalid-date', TIMESTAMP_FORMATS.dateDmy.value)).toBeNull();
      expect(parseTimestamp('invalid-date', TIMESTAMP_FORMATS.dateMdy.value)).toBeNull();
      expect(parseTimestamp('invalid-time', TIMESTAMP_FORMATS.time24h.value)).toBeNull();
      expect(parseTimestamp('invalid-time', TIMESTAMP_FORMATS.time12h.value)).toBeNull();
      expect(parseTimestamp('not-local-date', TIMESTAMP_FORMATS.local.value)).toBeNull();
    });

    it('should parse time24h and time12h variations', () => {
      const time24NoSec = parseTimestamp('06:13', TIMESTAMP_FORMATS.time24h.value, FIXED_BASE_TIME);
      expect(time24NoSec?.getUTCHours()).toBe(6);
      expect(time24NoSec?.getUTCMinutes()).toBe(13);
      expect(time24NoSec?.getUTCSeconds()).toBe(0);

      const time12NoSec = parseTimestamp('06:13 PM', TIMESTAMP_FORMATS.time12h.value, FIXED_BASE_TIME);
      expect(time12NoSec?.getUTCHours()).toBe(18);

      const noon12 = parseTimestamp('12:00 PM', TIMESTAMP_FORMATS.time12h.value, FIXED_BASE_TIME);
      expect(noon12?.getUTCHours()).toBe(12);

      const midnight12 = parseTimestamp('12:00 AM', TIMESTAMP_FORMATS.time12h.value, FIXED_BASE_TIME);
      expect(midnight12?.getUTCHours()).toBe(0);
    });

    it('should parse various relative time units and fallbacks', () => {
      const parsedSec = parseTimestamp('30s ago', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(parsedSec?.getTime()).toBe(FIXED_BASE_TIME - 30000);

      const parsedMin = parseTimestamp('10m ago', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(parsedMin?.getTime()).toBe(FIXED_BASE_TIME - 600000);

      const parsedWeek = parseTimestamp('2w ago', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(parsedWeek?.getTime()).toBe(FIXED_BASE_TIME - 2 * 604800000);

      const inSec = parseTimestamp('in 15s', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(inSec?.getTime()).toBe(FIXED_BASE_TIME + 15000);

      const inMin = parseTimestamp('in 5m', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(inMin?.getTime()).toBe(FIXED_BASE_TIME + 300000);

      const inHour = parseTimestamp('in 3h', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(inHour?.getTime()).toBe(FIXED_BASE_TIME + 3 * 3600000);

      const parsedHour = parseTimestamp('2h ago', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(parsedHour).toBeDefined();

      const parsedDay = parseTimestamp('2d ago', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(parsedDay).toBeDefined();

      const parsedYearAgo = parseTimestamp('1y ago', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(parsedYearAgo).toBeDefined();

      const inDay = parseTimestamp('in 3d', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(inDay).toBeDefined();

      const inWeek = parseTimestamp('in 2w', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(inWeek).toBeDefined();

      const inYear = parseTimestamp('in 1y', TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(inYear).toBeDefined();

      const parsedFallback = parseTimestamp('2024-06-10T06:13:20.000Z', TIMESTAMP_FORMATS.relative.value);
      expect(parsedFallback?.getTime()).toBe(FIXED_BASE_TIME);

      const parsedInvalid = parseTimestamp('unparseable string', TIMESTAMP_FORMATS.relative.value);
      expect(parsedInvalid).toBeNull();
    });

    it('should trigger exhaustiveCheck when unsupported format is passed to parseTimestamp', () => {
      const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});
      expect(() => parseTimestamp('123', 'unsupported' as never)).toThrow();
      traceSpy.mockRestore();
    });
  });

  describe('formatTimestamp', () => {
    it('should trigger exhaustiveCheck when unsupported format is passed to formatTimestamp', () => {
      const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});
      expect(() => formatTimestamp(FIXED_DATE, 'unsupported' as never)).toThrow();
      traceSpy.mockRestore();
    });
    it('should format into local string', () => {
      const local = formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.local.value);
      expect(typeof local).toBe('string');
      expect(local.length).toBeGreaterThan(0);
    });

    it('should format into unixSec', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.unixSec.value)).toBe('1718000000');
    });

    it('should format into unixMilli', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.unixMilli.value)).toBe('1718000000000');
    });

    it('should format into iso8601', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.iso8601.value)).toBe('2024-06-10T06:13:20.000Z');
    });

    it('should format into utc', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.utc.value)).toBe('Mon, 10 Jun 2024 06:13:20 GMT');
    });

    it('should format into sql datetime', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.sql.value)).toBe('2024-06-10 06:13:20');
    });

    it('should format into dateIso', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.dateIso.value)).toBe('2024-06-10');
    });

    it('should format into dateDmy', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.dateDmy.value)).toBe('10-06-2024');
    });

    it('should format into dateMdy', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.dateMdy.value)).toBe('06-10-2024');
    });

    it('should format into time24h', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.time24h.value)).toBe('06:13:20');
    });

    it('should format into time12h', () => {
      expect(formatTimestamp(FIXED_DATE, TIMESTAMP_FORMATS.time12h.value)).toBe('06:13:20 AM');

      const midnight = new Date(Date.UTC(2024, 5, 10, 0, 15, 30));
      expect(formatTimestamp(midnight, TIMESTAMP_FORMATS.time12h.value)).toBe('12:15:30 AM');

      const afternoon = new Date(Date.UTC(2024, 5, 10, 15, 45, 0));
      expect(formatTimestamp(afternoon, TIMESTAMP_FORMATS.time12h.value)).toBe('03:45:00 PM');
    });

    it('should format into relative string', () => {
      const pastDate = new Date(FIXED_BASE_TIME - 3600000);
      const relative = formatTimestamp(pastDate, TIMESTAMP_FORMATS.relative.value, FIXED_BASE_TIME);
      expect(relative).toContain('hour');
    });
  });

  describe('getRelativeTimeString', () => {
    it('should handle seconds diff', () => {
      const date = new Date(FIXED_BASE_TIME - 30000);
      expect(getRelativeTimeString(date, FIXED_BASE_TIME)).toBe('30 seconds ago');
    });

    it('should handle minutes diff', () => {
      const date = new Date(FIXED_BASE_TIME - 5 * 60000);
      expect(getRelativeTimeString(date, FIXED_BASE_TIME)).toBe('5 minutes ago');
    });

    it('should handle future hours diff', () => {
      const date = new Date(FIXED_BASE_TIME + 2 * 3600000);
      expect(getRelativeTimeString(date, FIXED_BASE_TIME)).toBe('in 2 hours');
    });

    it('should handle days diff', () => {
      const date = new Date(FIXED_BASE_TIME - 4 * 86400000);
      expect(getRelativeTimeString(date, FIXED_BASE_TIME)).toBe('4 days ago');
    });

    it('should handle months diff', () => {
      const date = new Date(FIXED_BASE_TIME - 60 * 86400000);
      expect(getRelativeTimeString(date, FIXED_BASE_TIME)).toBe('2 months ago');
    });

    it('should handle years diff', () => {
      const date = new Date(FIXED_BASE_TIME - 730 * 86400000);
      expect(getRelativeTimeString(date, FIXED_BASE_TIME)).toBe('2 years ago');
    });
  });

  describe('convertTimestamp', () => {
    it('should return empty result when input is empty', () => {
      const res = convertTimestamp('', TIMESTAMP_FORMATS.unixSec.value, TIMESTAMP_FORMATS.iso8601.value, testT);
      expect(res).toEqual({ result: '' });
    });

    it('should convert from unixSec to iso8601 successfully', () => {
      const res = convertTimestamp(
        '1718000000',
        TIMESTAMP_FORMATS.unixSec.value,
        TIMESTAMP_FORMATS.iso8601.value,
        testT,
        FIXED_BASE_TIME
      );
      expect(res).toEqual({ result: '2024-06-10T06:13:20.000Z' });
    });

    it('should return error when parsing invalid input', () => {
      const res = convertTimestamp(
        'invalid-timestamp',
        TIMESTAMP_FORMATS.unixSec.value,
        TIMESTAMP_FORMATS.iso8601.value,
        testT
      );
      expect(res.error).toBe(testT('timestampConverter.invalidDate'));
      expect(res.result).toBe('');
    });
  });

  describe('bulkConvertTimestamps', () => {
    it('should convert multiple newline separated timestamps', () => {
      const input = '1718000000\n1718000060';
      const res = bulkConvertTimestamps(
        input,
        TIMESTAMP_FORMATS.unixSec.value,
        TIMESTAMP_FORMATS.iso8601.value,
        testT,
        FIXED_BASE_TIME
      );

      expect(res.result).toBe('2024-06-10T06:13:20.000Z\n2024-06-10T06:14:20.000Z');
      expect(res.error).toBeUndefined();
    });

    it('should correctly convert multiple lines that contain commas without splitting on comma', () => {
      const input = 'Mon, 10 Jun 2024 06:13:20 GMT\nMon, 10 Jun 2024 06:14:20 GMT';
      const res = bulkConvertTimestamps(
        input,
        TIMESTAMP_FORMATS.utc.value,
        TIMESTAMP_FORMATS.unixSec.value,
        testT,
        FIXED_BASE_TIME
      );

      expect(res.result).toBe('1718000000\n1718000060');
      expect(res.error).toBeUndefined();
    });

    it('should handle mixed valid and invalid lines', () => {
      const input = '1718000000\ninvalid\n1718000060';
      const res = bulkConvertTimestamps(
        input,
        TIMESTAMP_FORMATS.unixSec.value,
        TIMESTAMP_FORMATS.iso8601.value,
        testT,
        FIXED_BASE_TIME
      );

      expect(res.result).toContain('2024-06-10T06:13:20.000Z');
      expect(res.result).toContain(testT('timestampConverter.invalidDate'));
      expect(res.error).toBe(testT('converter.bulkConverterWithErrors'));
    });
  });

  describe('getSampleTimestamp', () => {
    it('should return sample data with 10 lines from the last week', () => {
      const sample = getSampleTimestamp(TIMESTAMP_FORMATS.unixSec.value, FIXED_DATE);
      const lines = sample.split('\n');
      expect(lines).toHaveLength(10);
      lines.forEach((line) => {
        expect(line.length).toBeGreaterThan(0);
        const epoch = Number(line);
        expect(isNaN(epoch)).toBe(false);
        // Epoch should be within 7 days of FIXED_BASE_TIME
        expect(epoch).toBeLessThanOrEqual(Math.floor(FIXED_BASE_TIME / 1000));
        expect(epoch).toBeGreaterThanOrEqual(Math.floor(FIXED_BASE_TIME / 1000) - 7 * 86400);
      });
    });
  });
});
