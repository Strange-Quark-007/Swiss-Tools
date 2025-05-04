import { RegisterOptions } from 'react-hook-form';

import { TranslationFunction } from '@/i18n/utils';

export type ConversionType = 'from' | 'to';
export type BaseKey = keyof typeof BASES;
export type BaseType = (typeof BASES)[BaseKey]['value'];
export type ConversionResult = ReturnType<typeof convertNumbers>;

export const BASES = {
  binary: { value: 'binary', label: 'Binary', regex: /^(-)?[01]*$/, baseNum: 2 },
  octal: { value: 'octal', label: 'Octal', regex: /^(-)?[0-7]*$/, baseNum: 8 },
  decimal: { value: 'decimal', label: 'Decimal', regex: /^(-)?[0-9]*$/, baseNum: 10 },
  hex: { value: 'hex', label: 'Hexadecimal', regex: /^(-)?[0-9A-Fa-f]*$/, baseNum: 16 },
  custom: { value: 'custom', label: 'Custom Base', regex: null, baseNum: null },
} as const;

export interface CustomBaseFormValues {
  customBase: string;
}

export const isValidCustomBase = (value: string): boolean => {
  if (!value.trim()) return false;
  const numValue = parseInt(value, 10);
  return !isNaN(numValue) && numValue >= 2 && numValue <= 36;
};

export const getCustomBaseValidationRules = (
  t: TranslationFunction
): RegisterOptions<CustomBaseFormValues, 'customBase'> => ({
  required: t('numberConversion.baseRequired'),
  validate: {
    inRange: (value: string) => isValidCustomBase(value) || t('numberConversion.baseRange'),
  },
});

export const validateCustomBase = (value: string): string => {
  return isValidCustomBase(value) ? value : '';
};

export const getBaseNumber = (base?: BaseType | string): number | null => {
  if (!base) return null;

  if (base in BASES) {
    return BASES[base as BaseType].baseNum;
  }

  const baseNum = parseInt(String(base), 10);
  return !isNaN(baseNum) && baseNum >= 2 && baseNum <= 36 ? baseNum : null;
};

export const isValidInput = (text: string, base: BaseType | string): boolean => {
  if (!text.trim()) return true;

  if (base in BASES) {
    const { regex } = BASES[base as BaseType];
    if (regex) {
      return regex.test(text);
    }
  }

  const baseNum = getBaseNumber(base);
  if (baseNum === null) return false;

  if (baseNum <= 10) {
    return new RegExp(`^(-)?[0-${baseNum - 1}]*$`).test(text);
  } else {
    const lastChar = String.fromCharCode('A'.charCodeAt(0) + (baseNum - 11));
    return new RegExp(`^(-)?[0-9A-${lastChar}a-${lastChar.toLowerCase()}]*$`).test(text);
  }
};

export const convertNumbers = (
  fromText: string,
  fromBase: BaseType | string | undefined,
  toBase: BaseType | string | undefined,
  t: TranslationFunction
): { result: string; error?: string } => {
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
    return { result: '', error: t('numberConversion.invalidSourceBase') };
  }

  if (!toBase || toBaseNum === null) {
    return { result: '', error: t('numberConversion.invalidTargetBase') };
  }

  const results: string[] = [];
  let hasError = false;
  const baseLabel = fromBase in BASES ? BASES[fromBase as BaseType].label : `Base ${fromBase}`;

  for (const number of numbers) {
    if (number === '-' || number === '') {
      results.push('');
      continue;
    }

    if (!isValidInput(number, fromBase)) {
      hasError = true;
      results.push(`${number} → ${t('numberConversion.invalidCharacters', { base: baseLabel })}`);
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
    error: hasError ? t('numberConversion.bulkConversionWithErrors') : undefined,
  };
};
