import { TranslationFunction } from '@/i18n/utils';
import { StringUtils } from '@/lib/string-utils';
import { exhaustiveCheck } from '@/lib/utils';
import { ConversionResult } from '@/types/common';

export type CaseType = (typeof CASES)[keyof typeof CASES]['value'];

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

export const getCaseType = (caseType?: CaseType | string): CaseType | null => {
  if (!caseType) {
    return null;
  }

  if (caseType in CASES) {
    return caseType as CaseType;
  }

  return null;
};

export const convertTextCase = (
  fromText: string,
  fromCase: CaseType | undefined,
  toCase: CaseType | undefined,
  t: TranslationFunction
): ConversionResult => {
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
        case CASES.lowercase.value:
        case CASES.uppercase.value:
        case CASES.titlecase.value:
        case CASES.sentencecase.value:
          break;
        case CASES.camelcase.value:
          stringUtils.parseFromCamel();
          break;
        case CASES.pascalcase.value:
          stringUtils.parseFromPascal();
          break;
        case CASES.snakecase.value:
          stringUtils.parseFromSnake();
          break;
        case CASES.kebabcase.value:
          stringUtils.parseFromKebab();
          break;
        case CASES.dotcase.value:
          stringUtils.parseFromDot();
          break;
      }

      let convertedText = '';

      switch (toCaseType) {
        case CASES.lowercase.value:
          convertedText = stringUtils.toString().toLowerCase();
          break;
        case CASES.uppercase.value:
          convertedText = stringUtils.toString().toUpperCase();
          break;
        case CASES.titlecase.value:
          convertedText = stringUtils.toTitleCase().toString();
          break;
        case CASES.sentencecase.value:
          convertedText = stringUtils
            .toString()
            .toLowerCase()
            .replace(/(^\w|\.\s+\w)/g, (match) => match.toUpperCase());
          break;
        case CASES.camelcase.value:
          convertedText = stringUtils.toCamelCase().toString();
          break;
        case CASES.pascalcase.value:
          convertedText = stringUtils.toPascalCase().toString();
          break;
        case CASES.snakecase.value:
          convertedText = stringUtils.toSnakeCase().toString();
          break;
        case CASES.kebabcase.value:
          convertedText = stringUtils.toKebabCase().toString();
          break;
        case CASES.dotcase.value:
          convertedText = stringUtils.toDotCase().toString();
          break;
        default:
          exhaustiveCheck(toCaseType);
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
