import set from 'lodash/set';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'en-US';
  const dictionary = (await import(`../messages/${locale}.json`)).default;
  const output = Object.entries(dictionary).reduce((acc, [key, value]) => set(acc, key, value), {});

  return {
    locale,
    messages: output,
  };
});
