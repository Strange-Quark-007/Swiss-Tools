import set from 'lodash/set';
import { getRequestConfig } from 'next-intl/server';

import { LOCALE } from '@/constants/common';

const buildMessages = async (locale: string) => {
  'use cache';
  const dictionary = (await import(`../messages/${locale}.json`)).default;
  return Object.entries(dictionary).reduce((acc, [key, value]) => set(acc, key, value), {});
};

export default getRequestConfig(async () => {
  const locale = LOCALE;
  const output = await buildMessages(locale);

  return {
    locale,
    messages: output,
  };
});
