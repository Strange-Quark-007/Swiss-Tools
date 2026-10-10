import React from 'react';

import { TranslationFunction, TranslationValues } from '@/i18n/utils';
import enMessages from '@/messages/en-US.json';

/**
 * Creates a translation function backed by the actual `en-US.json` dictionary.
 * Throws an error if any requested translation key does not exist.
 */
export const createTestT = (): TranslationFunction => {
  const dictionary = enMessages as Record<string, string>;
  const appName = dictionary['app.name'];

  return (key: string, values?: TranslationValues) => {
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

const parseNodeToReact = (node: Node, key = 0): React.ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map((child, idx) => parseNodeToReact(child, idx));
    return React.createElement(tagName, { key }, ...children);
  }
  return null;
};

/**
 * Converts translated strings containing HTML/rich formatting into React nodes.
 */
export const createTestRichT = (t: TranslationFunction = testT) => {
  return (key: string, values?: TranslationValues): React.ReactNode => {
    const raw = t(key, values);
    if (!raw.includes('<')) {
      return raw;
    }
    const container = document.createElement('div');
    container.innerHTML = raw;
    return Array.from(container.childNodes).map((child, idx) => parseNodeToReact(child, idx));
  };
};

export const testRichT = createTestRichT();

/**
 * Normalizes text for comparison by collapsing redundant whitespaces and trimming.
 */
export const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

/**
 * Extracts the plain text content of a translation key by stripping any HTML tags.
 */
export const extractI18nText = (key: string, values?: TranslationValues): string => {
  const html = testT(key, values);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return normalizeWhitespace(doc.body.textContent ?? '');
};

/**
 * Extracts anchor details (text and href) at a specific index from translated HTML markup.
 */
export const getI18nLink = (key: string, values?: TranslationValues, index = 0): { text: string; href: string } => {
  const html = testT(key, values);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const anchor = doc.querySelectorAll('a')[index];

  return {
    text: normalizeWhitespace(anchor?.textContent ?? ''),
    href: anchor?.getAttribute('href') ?? '',
  };
};

/**
 * Retrieves the visible text of a hyperlink element at a given index within translated markup.
 */
export const getI18nLinkText = (key: string, values?: TranslationValues, linkIndex = 0): string => {
  return getI18nLink(key, values, linkIndex).text;
};

/**
 * Retrieves the href destination of a hyperlink element at a given index within translated markup.
 */
export const getI18nLinkHref = (key: string, values?: TranslationValues, linkIndex = 0): string => {
  return getI18nLink(key, values, linkIndex).href;
};

/**
 * Testing Library matcher that finds the innermost DOM element containing the translated text,
 * properly handling rich markup (e.g. <b>, <em>, <ul>, <br>).
 *
 * @example
 * ```tsx
 * expect(screen.getByText(matchI18nPlainText('privacy.dataCollection.text'))).toBeDefined();
 * ```
 */
export const matchI18nPlainText = (key: string, values?: TranslationValues) => {
  const expected = normalizeWhitespace(extractI18nText(key, values));

  return (_: string, node: Element | null): boolean => {
    if (!node?.textContent) {
      return false;
    }
    const current = normalizeWhitespace(node.textContent);
    if (!current.includes(expected)) {
      return false;
    }
    const hasDescendantMatch = Array.from(node.children).some((child) =>
      normalizeWhitespace(child.textContent ?? '').includes(expected)
    );
    return !hasDescendantMatch;
  };
};
