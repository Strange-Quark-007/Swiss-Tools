import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { LOCALE } from '@/constants/common';

export function useT() {
  const t = useTranslations();
  const appName = t('app.name');

  return (key: string, values?: Record<string, string | number>) => t(key, { appName, ...values });
}

export async function getT() {
  const t = await getTranslations({ locale: LOCALE });
  const appName = t('app.name');

  return (key: string, values?: Record<string, string | number>) => t(key, { appName, ...values });
}
