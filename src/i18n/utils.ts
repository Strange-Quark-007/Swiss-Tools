import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { LOCALE } from '@/constants/common';

export type TranslationKey = string;
export type TranslationValues = Record<string, string | number>;
export type TranslationFunction = (key: TranslationKey, values?: TranslationValues) => string;

export function useT(): TranslationFunction {
  const t = useTranslations();
  const appName = t('app.name');

  return (key: TranslationKey, values?: TranslationValues) => t(key, { appName, ...values });
}

export async function getT(): Promise<TranslationFunction> {
  const t = await getTranslations({ locale: LOCALE });
  const appName = t('app.name');

  return (key: TranslationKey, values?: TranslationValues) => t(key, { appName, ...values });
}
