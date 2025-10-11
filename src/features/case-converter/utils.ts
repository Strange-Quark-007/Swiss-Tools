import { StringUtils } from '@/lib/string-utils';
import { exhaustiveCheck } from '@/lib/utils';
import { ConverterResult, ValueUnion } from '@/types/common';

export type CaseType = ValueUnion<typeof CASES>;

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

export const convertTextCase = (fromText: string, fromCase: CaseType, toCase: CaseType): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const lines = fromText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  if (!lines.length) {
    return { result: '' };
  }

  const results: string[] = [];

  for (const line of lines) {
    const stringUtils = StringUtils.from(line);

    switch (fromCase) {
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
      default:
        exhaustiveCheck(fromCase);
    }

    let convertedText = '';

    switch (toCase) {
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
        convertedText = stringUtils.sanitize().toCamelCase().toString();
        break;
      case CASES.pascalcase.value:
        convertedText = stringUtils.sanitize().toPascalCase().toString();
        break;
      case CASES.snakecase.value:
        convertedText = stringUtils.sanitize().toSnakeCase().toString();
        break;
      case CASES.kebabcase.value:
        convertedText = stringUtils.sanitize().toKebabCase().toString();
        break;
      case CASES.dotcase.value:
        convertedText = stringUtils.sanitize().toDotCase().toString();
        break;
      default:
        exhaustiveCheck(toCase);
    }

    results.push(convertedText);
  }

  return { result: results.join('\n') };
};
