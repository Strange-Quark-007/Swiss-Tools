import { ROUTES } from '@/constants/routes';
import { TranslationFunction } from '@/i18n/utils';

import { StringUtils } from './string-utils';

export const exhaustiveCheck = (x: never): never => {
  throw new Error('Unexpected case: ' + x);
};

export const getFirst = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const ROUTE_PREFIX_MAP = Object.fromEntries(
  (Object.keys(ROUTES) as (keyof typeof ROUTES)[]).map((key) => [
    ROUTES[key],
    StringUtils.from(key).toCamelCase().toString(),
  ])
) as Record<string, string>;

/**
 * Automatically derives the translation key prefix from a route.
 * Matches keys in en-US.json by resolving via ROUTES enum.
 *
 * Examples:
 * - '/' -> 'home'
 * - '/case-converter' -> 'caseConverter'
 * - '/unit-converter/length' -> 'lengthConverter'
 * - '/unit-converter/data-size' -> 'dataSizeConverter'
 */
export const getRoutePrefix = (pathname: ROUTES | string): string => {
  return (
    ROUTE_PREFIX_MAP[pathname || ROUTES.HOME] ??
    StringUtils.from(pathname.replace(/^\/+/, '').replace(/\//g, '-')).toCamelCase().toString()
  );
};

export const getPageTitle = (pathname: string, t: TranslationFunction): string => {
  const prefix = getRoutePrefix(pathname);
  return t(`${prefix}.name`);
};
