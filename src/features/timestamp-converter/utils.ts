import { tz, TZDate } from '@date-fns/tz';
import {
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  addWeeks,
  addYears,
  format,
  formatDistanceStrict,
  fromUnixTime,
  getTime,
  getUnixTime,
  isValid,
  parse,
  parseISO,
  subDays,
  subHours,
  subMilliseconds,
  subMinutes,
  subSeconds,
  subWeeks,
  subYears,
  toDate,
} from 'date-fns';

import { TOOLTIP_TYPE } from '@/constants/common';
import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { exhaustiveCheck } from '@/lib/utils';
import { ConverterResult, ValueUnion } from '@/types/common';

const UTC = tz('UTC');

export const TIMESTAMP_FORMATS = {
  //Standard
  unixSec: { value: 'unixSec', label: 'Unix (Seconds)', group: 'Standard' },
  unixMilli: { value: 'unixMilli', label: 'Unix (Milliseconds)', group: 'Standard' },
  iso8601: { value: 'iso8601', label: 'ISO 8601 (UTC)', group: 'Standard' },
  utc: { value: 'utc', label: 'UTC String (RFC 1123)', group: 'Standard' },

  // Date & Time
  sql: { value: 'sql', label: 'SQL (YYYY-MM-DD HH:mm:ss)', group: 'Date & Time' },
  local: { value: 'local', label: 'Local Date-Time', group: 'Date & Time' },

  // Date Only
  dateIso: { value: 'dateIso', label: 'YYYY-MM-DD', group: 'Date Only' },
  dateDmy: { value: 'dateDmy', label: 'DD-MM-YYYY', group: 'Date Only' },
  dateMdy: { value: 'dateMdy', label: 'MM-DD-YYYY', group: 'Date Only' },

  // Time Only
  time24h: { value: 'time24h', label: '24h (HH:mm:ss)', group: 'Time Only' },
  time12h: { value: 'time12h', label: '12h (hh:mm:ss a)', group: 'Time Only' },

  // Relative
  relative: {
    value: 'relative',
    label: 'Relative Time',
    group: 'Relative',
    tooltip: {
      type: TOOLTIP_TYPE.info,
      messageKey: 'timestampConverter.relativeTooltip',
    },
  },
} as const;

export type TimestampFormatType = ValueUnion<typeof TIMESTAMP_FORMATS>;

/**
 * Calculates human-readable relative time using date-fns formatDistanceStrict.
 */
export const getRelativeTimeString = (date: Date, baseTime: number = Date.now()): string => {
  return formatDistanceStrict(date, baseTime, { addSuffix: true });
};

/**
 * Parses relative time descriptions (e.g. "now", "yesterday", "2 hours ago", "in 3 days").
 */
const parseRelativeString = (input: string, baseTime: number = Date.now()): Date | null => {
  const lower = input.toLowerCase().trim();
  const base = toDate(baseTime);

  if (lower === 'now') {
    return base;
  }
  if (lower === 'yesterday') {
    return subDays(base, 1);
  }
  if (lower === 'tomorrow') {
    return addDays(base, 1);
  }

  const agoMatch = lower.match(/^(\d+)\s*(s|sec|seconds?|m|min|minutes?|h|hr|hours?|d|days?|w|weeks?|y|years?)\s*ago$/);
  if (agoMatch) {
    const amount = Number(agoMatch[1]);
    const unit = agoMatch[2][0];
    switch (unit) {
      case 's':
        return subSeconds(base, amount);
      case 'm':
        return subMinutes(base, amount);
      case 'h':
        return subHours(base, amount);
      case 'd':
        return subDays(base, amount);
      case 'w':
        return subWeeks(base, amount);
      case 'y':
        return subYears(base, amount);
    }
  }

  const inMatch = lower.match(/^in\s*(\d+)\s*(s|sec|seconds?|m|min|minutes?|h|hr|hours?|d|days?|w|weeks?|y|years?)$/);
  if (inMatch) {
    const amount = Number(inMatch[1]);
    const unit = inMatch[2][0];
    switch (unit) {
      case 's':
        return addSeconds(base, amount);
      case 'm':
        return addMinutes(base, amount);
      case 'h':
        return addHours(base, amount);
      case 'd':
        return addDays(base, amount);
      case 'w':
        return addWeeks(base, amount);
      case 'y':
        return addYears(base, amount);
    }
  }

  return null;
};

const parseWithFormats = (
  input: string,
  formats: string[],
  referenceDate: Date = new TZDate(0, 'UTC'),
  fallbackToNative = true
): Date | null => {
  for (const fmt of formats) {
    const parsed = parse(input, fmt, referenceDate);
    if (isValid(parsed)) {
      return parsed;
    }
  }
  if (!fallbackToNative) {
    return null;
  }
  const fallback = toDate(input);
  return isValid(fallback) ? fallback : null;
};

/**
 * Parses an input string in accordance with the specified timestamp format.
 */
export const parseTimestamp = (
  input: string,
  from: TimestampFormatType,
  baseTime: number = Date.now()
): Date | null => {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  switch (from) {
    case TIMESTAMP_FORMATS.unixSec.value: {
      if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return fromUnixTime(Number(trimmed));
      }
      return null;
    }

    case TIMESTAMP_FORMATS.unixMilli.value: {
      if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return toDate(Number(trimmed));
      }
      return null;
    }

    case TIMESTAMP_FORMATS.sql.value:
      return parseWithFormats(trimmed, ['yyyy-MM-dd HH:mm:ss', "yyyy-MM-dd'T'HH:mm:ss"]);

    case TIMESTAMP_FORMATS.dateIso.value:
      return parseWithFormats(trimmed, ['yyyy-MM-dd', 'yyyy/MM/dd']);

    case TIMESTAMP_FORMATS.dateDmy.value:
      return parseWithFormats(trimmed, ['dd-MM-yyyy', 'dd/MM/yyyy']);

    case TIMESTAMP_FORMATS.dateMdy.value:
      return parseWithFormats(trimmed, ['MM-dd-yyyy', 'MM/dd/yyyy']);

    case TIMESTAMP_FORMATS.time24h.value:
      return parseWithFormats(trimmed, ['HH:mm:ss', 'HH:mm'], new TZDate(baseTime, 'UTC'), false);

    case TIMESTAMP_FORMATS.time12h.value:
      return parseWithFormats(trimmed, ['hh:mm:ss a', 'hh:mm a'], new TZDate(baseTime, 'UTC'), false);

    case TIMESTAMP_FORMATS.relative.value: {
      const parsedRel = parseRelativeString(trimmed, baseTime);
      if (parsedRel) return parsedRel;
      const fallback = toDate(trimmed);
      return isValid(fallback) ? fallback : null;
    }

    case TIMESTAMP_FORMATS.iso8601.value: {
      const parsed = parseISO(trimmed);
      return isValid(parsed) ? parsed : null;
    }

    case TIMESTAMP_FORMATS.utc.value:
    case TIMESTAMP_FORMATS.local.value: {
      const d = toDate(trimmed);
      return isValid(d) ? d : null;
    }

    default:
      return exhaustiveCheck(from);
  }
};

/**
 * Formats a Date object into the desired output timestamp format.
 */
export const formatTimestamp = (date: Date, to: TimestampFormatType, baseTime: number = Date.now()): string => {
  switch (to) {
    case TIMESTAMP_FORMATS.unixSec.value:
      return getUnixTime(date).toString();

    case TIMESTAMP_FORMATS.unixMilli.value:
      return getTime(date).toString();

    case TIMESTAMP_FORMATS.iso8601.value:
      return date.toISOString();

    case TIMESTAMP_FORMATS.utc.value:
      return date.toUTCString();

    case TIMESTAMP_FORMATS.sql.value:
      return format(date, 'yyyy-MM-dd HH:mm:ss', { in: UTC });

    case TIMESTAMP_FORMATS.dateIso.value:
      return format(date, 'yyyy-MM-dd', { in: UTC });

    case TIMESTAMP_FORMATS.dateDmy.value:
      return format(date, 'dd-MM-yyyy', { in: UTC });

    case TIMESTAMP_FORMATS.dateMdy.value:
      return format(date, 'MM-dd-yyyy', { in: UTC });

    case TIMESTAMP_FORMATS.time24h.value:
      return format(date, 'HH:mm:ss', { in: UTC });

    case TIMESTAMP_FORMATS.time12h.value:
      return format(date, 'hh:mm:ss a', { in: UTC });

    case TIMESTAMP_FORMATS.local.value:
      return date.toLocaleString();

    case TIMESTAMP_FORMATS.relative.value:
      return getRelativeTimeString(date, baseTime);

    default:
      return exhaustiveCheck(to);
  }
};

/**
 * Converts a single timestamp string from one format to another.
 */
export const convertTimestamp = (
  input: string,
  from: TimestampFormatType,
  to: TimestampFormatType,
  t: TranslationFunction,
  baseTime: number = Date.now()
): ConverterResult => {
  if (!input.trim()) {
    return { result: '' };
  }

  const date = parseTimestamp(input, from, baseTime);
  if (!date || !isValid(date)) {
    return {
      result: '',
      error: t('timestampConverter.invalidDate'),
    };
  }

  return {
    result: formatTimestamp(date, to, baseTime),
  };
};

/**
 * Handles bulk conversion of line or comma separated timestamps.
 */
export const bulkConvertTimestamps = (
  fromText: string,
  from: TimestampFormatType,
  to: TimestampFormatType,
  t: TranslationFunction,
  baseTime: number = Date.now()
): ConverterResult => {
  return bulkProcessor({
    fromText,
    processor: (item) => convertTimestamp(item, from, to, t, baseTime),
    converterArgs: [],
    bulkErrorTranslation: t('converter.bulkConverterWithErrors'),
    delimiterRegex: /\r?\n/,
  });
};

/**
 * Generates 10 random sample timestamps from the past week.
 */
export const getSampleTimestamp = (format: TimestampFormatType, baseDate = new Date()): string => {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const baseTime = baseDate.getTime();

  // Generate 10 random offsets across the last 7 days
  const offsets = Array.from({ length: 10 }, () => Math.floor(Math.random() * ONE_WEEK_MS));

  return offsets.map((offset) => formatTimestamp(subMilliseconds(baseDate, offset), format, baseTime)).join('\n');
};
