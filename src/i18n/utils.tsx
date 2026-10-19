import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { LOCALE } from '@/constants/common';

export type TranslationKey = string;
export type TranslationValues = Record<string, string | number>;
export type RichTag = 'span' | 'p' | 'b' | 'strong' | 'i' | 'em' | 'code' | 'br' | 'ul' | 'ol' | 'li';

export type RichTranslationValues = {
  classNames?: Partial<Record<RichTag, string>>;
  [key: string]:
    string | number | ((chunk: React.ReactNode) => React.ReactNode) | Partial<Record<RichTag, string>> | undefined;
};

export type TranslationFunction = (key: TranslationKey, values?: TranslationValues) => string;
export type RichTranslationFunction = (key: TranslationKey, values?: RichTranslationValues) => React.ReactNode;

export interface Translations {
  t: TranslationFunction;
  richT: RichTranslationFunction;
}

const createDefaultComponents = (classNames?: Partial<Record<RichTag, string>>) => ({
  span: (chunk: React.ReactNode) => <span className={classNames?.span}>{chunk}</span>,
  p: (chunk: React.ReactNode) => <p className={classNames?.p}>{chunk}</p>,
  b: (chunk: React.ReactNode) => <b className={classNames?.b}>{chunk}</b>,
  strong: (chunk: React.ReactNode) => <strong className={classNames?.strong}>{chunk}</strong>,
  i: (chunk: React.ReactNode) => <i className={classNames?.i}>{chunk}</i>,
  em: (chunk: React.ReactNode) => <em className={classNames?.em}>{chunk}</em>,
  code: (chunk: React.ReactNode) => <code className={classNames?.code}>{chunk}</code>,
  br: () => <br className={classNames?.br} />,
  ul: (chunk: React.ReactNode) => <ul className={classNames?.ul}>{chunk}</ul>,
  ol: (chunk: React.ReactNode) => <ol className={classNames?.ol}>{chunk}</ol>,
  li: (chunk: React.ReactNode) => <li className={classNames?.li}>{chunk}</li>,
});

export function useT(): Translations {
  const t = useTranslations();
  const appName = t('app.name');

  const plainT = (key: TranslationKey, values?: TranslationValues) => t(key, { appName, ...values });

  const richT = (key: TranslationKey, values?: RichTranslationValues) => {
    const { classNames, ...rest } = values ?? {};
    return t.rich(key, { ...createDefaultComponents(classNames), appName, ...rest });
  };

  return { t: plainT, richT };
}

export async function getT(): Promise<Translations> {
  const t = await getTranslations({ locale: LOCALE });
  const appName = t('app.name');

  const plainT = (key: TranslationKey, values?: TranslationValues) => t(key, { appName, ...values });

  const richT = (key: TranslationKey, values?: RichTranslationValues) => {
    const { classNames, ...rest } = values ?? {};
    return t.rich(key, { ...createDefaultComponents(classNames), appName, ...rest });
  };

  return { t: plainT, richT };
}
