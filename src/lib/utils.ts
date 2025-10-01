import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { TranslationFunction } from '@/i18n/utils';

import { StringUtils } from './string-utils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exhaustiveCheck = (x: never): never => {
  throw new Error('Unexpected case: ' + x);
};

export const getFirst = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const getPageTitle = (pathname: string, t: TranslationFunction): string => {
  const isHome = !pathname || pathname === '' || pathname === '/';

  const path = !isHome && StringUtils.from(pathname.split('/')[1]).parseFromKebab().toCamelCase().toString();
  const title = isHome ? t('home.name') : t(`${path}.name`);

  return title;
};
