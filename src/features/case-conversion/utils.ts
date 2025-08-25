import { RegisterOptions } from 'react-hook-form';

import { TranslationFunction } from '@/i18n/utils';
import { StringUtils } from '@/lib/StringUtils';

export type ConversionType = 'from' | 'to';
export type CaseKey = keyof typeof CASES;
export type CaseType = (typeof CASES)[CaseKey]['value'];
export type ConversionResult = ReturnType<typeof convertTextCase>;

export const CASES = {
  lowercase: { value: 'lowercase', label: 'lowercase' },
  uppercase: { value: 'uppercase', label: 'UPPERCASE' },
  titlecase: { value: 'titlecase', label: 'Title Case' },
  sentencecase: { value: 'sentencecase', label: 'Sentence case' },
  camelcase: { value: 'camelcase', label: 'camelCase' },
  pascalcase: { value: 'pascalcase', label: 'PascalCase' },
  snakecase: { value: 'snakecase', label: 'snake_case' },
  kebabcase: { value: 'kebabcase', label: 'kebab-case' },
  dotcase: { value: 'dotcase', label: 'dot.case' },
} as const;

export interface CustomCaseFormValues {
  customCase: string;
}

export const isValidCustomCase = (value: string): boolean => {
  return value.trim().length > 0;
};

export const getCustomCaseValidationRules = (
  t: TranslationFunction
): RegisterOptions<CustomCaseFormValues, 'customCase'> => ({
  required: t('caseConversion.caseRequired'),
  validate: {
    notEmpty: (value: string) => isValidCustomCase(value) || t('caseConversion.caseRequired'),
  },
});

export const validateCustomCase = (value: string): string => {
  return isValidCustomCase(value) ? value : '';
};

export const getCaseType = (caseType?: CaseType | string): CaseType | null => {
  if (!caseType) return null;

  if (caseType in CASES) {
    return caseType as CaseType;
  }

  return null;
};

export const isValidInput = (text: string): boolean => {
  return text.trim().length > 0;
};

export const convertTextCase = (
  fromText: string,
  fromCase: CaseType | string | undefined,
  toCase: CaseType | string | undefined,
  t: TranslationFunction
): { result: string; error?: string } => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const lines = fromText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  if (lines.length === 0) {
    return { result: '' };
  }

  const fromCaseType = getCaseType(fromCase);
  const toCaseType = getCaseType(toCase);

  if (!fromCase || fromCaseType === null) {
    return { result: '', error: t('caseConversion.invalidSourceCase') };
  }

  if (!toCase || toCaseType === null) {
    return { result: '', error: t('caseConversion.invalidTargetCase') };
  }

  const results: string[] = [];
  let hasError = false;

  for (const line of lines) {
    if (line.trim() === '') {
      results.push('');
      continue;
    }

    try {
      const stringUtils = StringUtils.from(line);

      switch (fromCaseType) {
        case 'lowercase':
        case 'uppercase':
        case 'titlecase':
        case 'sentencecase':
          break;
        case 'camelcase':
          stringUtils.parseFromCamel();
          break;
        case 'pascalcase':
          stringUtils.parseFromPascal();
          break;
        case 'snakecase':
          stringUtils.parseFromSnake();
          break;
        case 'kebabcase':
          stringUtils.parseFromKebab();
          break;
        case 'dotcase':
          stringUtils.parseFromDot();
          break;
      }

      let convertedText = '';

      switch (toCaseType) {
        case 'lowercase':
          convertedText = stringUtils.toString().toLowerCase();
          break;
        case 'uppercase':
          convertedText = stringUtils.toString().toUpperCase();
          break;
        case 'titlecase':
          convertedText = stringUtils.toTitleCase().toString();
          break;
        case 'sentencecase':
          convertedText = stringUtils
            .toString()
            .toLowerCase()
            .replace(/(^\w|\.\s+\w)/g, (match) => match.toUpperCase());
          break;
        case 'camelcase':
          convertedText = stringUtils.toCamelCase().toString();
          break;
        case 'pascalcase':
          convertedText = stringUtils.toPascalCase().toString();
          break;
        case 'snakecase':
          convertedText = stringUtils.toSnakeCase().toString();
          break;
        case 'kebabcase':
          convertedText = stringUtils.toKebabCase().toString();
          break;
        case 'dotcase':
          convertedText = stringUtils.toDotCase().toString();
          break;
        default:
          convertedText = stringUtils.toString();
      }

      if (!convertedText && line.trim()) {
        hasError = true;
        results.push(`${line} → Empty result`);
      } else {
        results.push(convertedText);
      }
    } catch (_error) {
      hasError = true;
      results.push(`${line} → Error converting`);
    }
  }

  return {
    result: results.join('\n'),
    error: hasError ? t('caseConversion.bulkConversionWithErrors') : undefined,
  };
};
