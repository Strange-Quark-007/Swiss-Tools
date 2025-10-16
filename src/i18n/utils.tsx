import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { LOCALE } from '@/constants/common';

export type TranslationKey = string;
export type TranslationValues = Record<string, string | number>;
export type RichTranslationValues = Record<string, string | number | ((chunk: React.ReactNode) => React.ReactNode)>;

export type TranslationFunction = (key: TranslationKey, values?: TranslationValues) => string;
export type RichTranslationFunction = (key: TranslationKey, values?: RichTranslationValues) => React.ReactNode;

export interface Translations {
  t: TranslationFunction;
  richT: RichTranslationFunction;
}

const defaultComponents = {
  p: (chunk: React.ReactNode) => <p>{chunk}</p>,
  b: (chunk: React.ReactNode) => <b>{chunk}</b>,
  em: (chunk: React.ReactNode) => <em>{chunk}</em>,
  i: (chunk: React.ReactNode) => <i>{chunk}</i>,
  strong: (chunk: React.ReactNode) => <strong>{chunk}</strong>,
  br: () => <br />,
  ul: (chunk: React.ReactNode) => <ul className="list-disc list-inside p-2">{chunk}</ul>,
  li: (chunk: React.ReactNode) => <li className="mb-1.5">{chunk}</li>,
};

export function useT(): Translations {
  const t = useTranslations();
  const appName = t('app.name');

  const plainT = (key: TranslationKey, values?: TranslationValues) => t(key, { appName, ...values });

  const richT = (key: TranslationKey, values?: RichTranslationValues) =>
    t.rich(key, { ...defaultComponents, appName, ...values });

  return { t: plainT, richT };
}

export async function getT(): Promise<Translations> {
  const t = await getTranslations({ locale: LOCALE });
  const appName = t('app.name');

  const plainT = (key: TranslationKey, values?: TranslationValues) => t(key, { appName, ...values });

  const richT = (key: TranslationKey, values?: RichTranslationValues) =>
    t.rich(key, { ...defaultComponents, appName, ...values });

  return { t: plainT, richT };
}
