import { TranslationFunction } from '@/i18n/utils';
import enMessages from '@/messages/en-US.json';

/**
 * Creates a translation function backed by the actual `en-US.json` dictionary.
 * Throws an error if any requested translation key does not exist.
 */
export const createTestT = (): TranslationFunction => {
  const dictionary = enMessages as Record<string, string>;
  const appName = dictionary['app.name'];

  return (key: string, values?: Record<string, string | number>) => {
    const raw = dictionary[key];
    if (raw === undefined) {
      throw new Error(`Missing translation key in en-US.json: "${key}"`);
    }

    if (!raw.includes('{')) {
      return raw;
    }

    const allValues: Record<string, string | number> = { appName, ...values };

    return raw.replace(/\{(\w+)\}/g, (_, token) => {
      return allValues[token] !== undefined ? String(allValues[token]) : `{${token}}`;
    });
  };
};

export const testT = createTestT();
