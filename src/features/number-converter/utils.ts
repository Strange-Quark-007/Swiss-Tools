import { RegisterOptions } from 'react-hook-form';

import { TranslationFunction } from '@/i18n/utils';
import { ConverterResult } from '@/types/common';

export type BaseType = (typeof BASES)[keyof typeof BASES]['value'];

export const BASES = {
  binary: { value: 'binary', label: 'Binary', baseNum: 2, regex: /^(-)?[01]*$/ },
  octal: { value: 'octal', label: 'Octal', baseNum: 8, regex: /^(-)?[0-7]*$/ },
  decimal: { value: 'decimal', label: 'Decimal', baseNum: 10, regex: /^(-)?[0-9]*$/ },
  hex: { value: 'hex', label: 'Hexadecimal', baseNum: 16, regex: /^(-)?[0-9A-Fa-f]*$/ },
  custom: { value: 'custom', label: 'Custom Base', baseNum: null, regex: null },
} as const;

export interface CustomBaseFormValues {
  customBase: string;
}

export const isValidCustomBase = (value: string): boolean => {
  if (!value.trim()) {
    return false;
  }
  const numValue = parseInt(value, 10);
  return !isNaN(numValue) && numValue <= 36;
};

export const getCustomBaseValidationRules = (t: TranslationFunction): RegisterOptions<CustomBaseFormValues> => ({
  required: t('numberConverter.baseRequired'),
  validate: {
    inRange: (value: string) => isValidCustomBase(value) || t('numberConverter.baseRange'),
  },
});

export const validateCustomBase = (value: string): string => {
  return isValidCustomBase(value) ? value : '';
};

export const getBaseNumber = (base?: BaseType | string): number | null => {
  if (!base) {
    return null;
  }

  if (base in BASES) {
    return BASES[base as BaseType].baseNum;
  }

  const baseNum = parseInt(String(base), 10);
  return !isNaN(baseNum) && baseNum >= 2 && baseNum <= 36 ? baseNum : null;
};

export const isValidInput = (text: string, base: BaseType | string) => {
  if (!text.trim()) {
    return { valid: true, invalidChars: [] };
  }

  let pattern: RegExp;

  if (base in BASES) {
    const { regex } = BASES[base as BaseType];
    if (regex) {
      pattern = regex;
    }
  }

  const baseNum = getBaseNumber(base);
  if (baseNum === null) {
    return { valid: false, invalidChars: [] };
  }

  if (baseNum <= 10) {
    pattern = new RegExp(`^(-)?[0-${baseNum - 1}]*$`);
  } else {
    const lastChar = String.fromCharCode('A'.charCodeAt(0) + (baseNum - 11));
    pattern = new RegExp(`^(-)?[0-9A-${lastChar}a-${lastChar.toLowerCase()}]*$`);
  }
  if (!pattern) {
    return { valid: false, invalidChars: [] };
  }

  const valid = pattern.test(text);

  if (valid) {
    return { valid: true, invalidChars: [] };
  }

  // figure out which characters are invalid
  // take regex's character class part
  const charPattern = pattern.source
    .replace(/^\^\(-\)\??/, '') // drop ^(-)? at start
    .replace(/\*?\$$/, ''); // drop * or $ at end

  const charRegex = new RegExp(charPattern, 'g');

  const stripped = text.replace(/^-/, '').replace(charRegex, '');
  const invalidChars = [...new Set(stripped.split(''))].filter(Boolean);

  return { valid: false, invalidChars };
};

export const convertNumbers = (
  fromText: string,
  fromBase: BaseType | string | undefined,
  toBase: BaseType | string | undefined,
  t: TranslationFunction
): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const numbers = fromText
    .split(/[,\n]/)
    .map((num) => num.trim())
    .filter((num) => num !== '');

  if (numbers.length === 0) {
    return { result: '' };
  }

  const fromBaseNum = getBaseNumber(fromBase);
  const toBaseNum = getBaseNumber(toBase);

  if (!fromBase || fromBaseNum === null) {
    return { result: '', error: t('numberConverter.invalidSourceBase') };
  }

  if (!toBase || toBaseNum === null) {
    return { result: '', error: t('numberConverter.invalidTargetBase') };
  }

  const results: string[] = [];
  let hasError = false;
  const baseLabel = fromBase in BASES ? BASES[fromBase as BaseType].label : `Base ${fromBase}`;

  for (const number of numbers) {
    if (number === '-' || number === '') {
      results.push('');
      continue;
    }

    const { valid, invalidChars } = isValidInput(number, fromBase);
    const chars = `[${invalidChars.join(', ')}]`;

    if (!valid) {
      hasError = true;
      results.push(`${number} → ${t('numberConverter.invalidCharacters', { chars, base: baseLabel })}`);
      continue;
    }

    try {
      const parsedValue = parseInt(number, fromBaseNum);
      results.push(parsedValue.toString(toBaseNum));
    } catch (_error) {
      hasError = true;
      results.push(`${number} → Error converting`);
    }
  }

  return {
    result: results.join('\n'),
    error: hasError ? t('numberConverter.bulkConverterWithErrors') : undefined,
  };
};
