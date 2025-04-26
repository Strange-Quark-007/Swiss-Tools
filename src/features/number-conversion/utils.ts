import { RegisterOptions } from 'react-hook-form';

export type ConversionType = 'from' | 'to';
export type BaseKey = keyof typeof BASES;
export type BaseType = (typeof BASES)[BaseKey]['value'];
export type ConversionResult = ReturnType<typeof convertNumber>;

export const BASES = {
  binary: { value: 'binary', label: 'Binary', regex: /^[01]+$/, baseNum: 2 },
  octal: { value: 'octal', label: 'Octal', regex: /^[0-7]+$/, baseNum: 8 },
  decimal: { value: 'decimal', label: 'Decimal', regex: /^[0-9]+$/, baseNum: 10 },
  hex: { value: 'hex', label: 'Hexadecimal', regex: /^[0-9A-Fa-f]+$/, baseNum: 16 },
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

export const customBaseValidationRules: RegisterOptions<CustomBaseFormValues, 'customBase'> = {
  required: 'Base is required',
  validate: {
    inRange: (value: string) => isValidCustomBase(value) || 'Base must be between 2 and 36',
  },
};

export const validateCustomBase = (value: string): string => {
  return isValidCustomBase(value) ? value : '';
};

export const getBaseNumber = (base: BaseType | string): number | null => {
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
    return new RegExp(`^[0-${baseNum - 1}]+$`).test(text);
  } else {
    const lastChar = String.fromCharCode('A'.charCodeAt(0) + (baseNum - 11));
    return new RegExp(`^[0-9A-${lastChar}a-${lastChar.toLowerCase()}]+$`).test(text);
  }
};

export const convertNumber = (
  fromText: string,
  fromBase: BaseType | string,
  toBase: BaseType | string
): { result: string; error?: string } => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const fromBaseNum = getBaseNumber(fromBase);
  const toBaseNum = getBaseNumber(toBase);

  if (fromBaseNum === null) {
    return { result: '', error: 'Invalid source base' };
  }

  if (toBaseNum === null) {
    return { result: '', error: 'Invalid target base' };
  }

  if (!isValidInput(fromText, fromBase)) {
    const baseLabel = fromBase in BASES ? BASES[fromBase as BaseType].label : `base ${fromBase}`;
    return { result: '', error: `Invalid characters for ${baseLabel}` };
  }

  try {
    const parsedValue = parseInt(fromText, fromBaseNum);

    if (isNaN(parsedValue)) {
      return { result: '', error: 'Invalid number format' };
    }

    return { result: parsedValue.toString(toBaseNum) };
  } catch (error) {
    console.error('Conversion error:', error);
    return { result: '', error: 'Conversion error occurred' };
  }
};
