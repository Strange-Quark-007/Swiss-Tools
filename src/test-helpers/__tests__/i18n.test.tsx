import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  createTestRichT,
  createTestT,
  extractI18nText,
  getI18nLink,
  getI18nLinkHref,
  getI18nLinkText,
  matchI18nPlainText,
  normalizeWhitespace,
  testRichT,
  testT,
} from '../i18n';

describe('i18n test helpers', () => {
  it('should return translation for existing key without interpolation', () => {
    expect(testT('app.name')).toBe('Swiss Tools');
  });

  it('should automatically interpolate {appName} into translations', () => {
    expect(testT('app.meta.title')).toBe('Swiss Tools | Modular Web Utilities for Everyone');
  });

  it('should interpolate custom parameters passed in values', () => {
    expect(testT('aria.copyContext', { context: 'JSON payload' })).toBe('Copy JSON payload');
  });

  it('should leave unmatched placeholder tokens intact if not supplied in values', () => {
    expect(testT('aria.copyContext')).toBe('Copy {context}');
  });

  it('should throw an error when a requested translation key is missing from en-US.json', () => {
    expect(() => testT('non.existent.key')).toThrow('Missing translation key in en-US.json: "non.existent.key"');
  });

  it('should create an independent translation function via createTestT()', () => {
    const customT = createTestT();
    expect(customT('app.name')).toBe('Swiss Tools');
  });

  describe('normalizeWhitespace', () => {
    it('should collapse whitespace and trim', () => {
      expect(normalizeWhitespace('   hello    world\n\t ')).toBe('hello world');
    });
  });

  describe('testRichT', () => {
    it('should return string directly if no HTML tags are present', () => {
      expect(testRichT('app.name')).toBe('Swiss Tools');
    });

    it('should parse HTML tags into React nodes', () => {
      const customRichT = createTestRichT();
      const node = customRichT('privacy.dataCollection.text');
      expect(node).toBeDefined();
    });

    it('should handle non-element nodes like comments cleanly', () => {
      const mockT = () => '<!-- comment --><span>text</span>';
      const richT = createTestRichT(mockT);
      const nodes = richT('any.key');
      expect(Array.isArray(nodes)).toBe(true);
      expect((nodes as unknown[]).length).toBe(2);
    });

    it('should apply classNames to parsed elements', () => {
      const mockT = () => '<p>hello</p>';
      const richT = createTestRichT(mockT);
      const node = richT('any.key', { classNames: { p: 'test-class' } });
      expect(Array.isArray(node)).toBe(true);
      const pElement = (node as React.ReactElement<{ className?: string }>[])[0];
      expect(pElement.props.className).toBe('test-class');
    });

    it('should invoke custom render function when provided', () => {
      const mockT = () => '<b>bold</b>';
      const richT = createTestRichT(mockT);
      const node = richT('any.key', { b: (chunk) => <strong className="custom">{chunk}</strong> });
      expect(Array.isArray(node)).toBe(true);
    });
  });

  describe('extractI18nText', () => {
    it('should strip HTML tags and return plain text content', () => {
      const text = extractI18nText('privacy.dataCollection.text');
      expect(text).toContain('We collect minimal analytics data');
      expect(text).not.toContain('<ul>');
      expect(text).not.toContain('<li>');
    });

    it('should return empty string when doc.body has null textContent', () => {
      const parseSpy = vi.spyOn(DOMParser.prototype, 'parseFromString').mockReturnValueOnce({
        body: { textContent: null },
      } as unknown as Document);

      expect(extractI18nText('app.name')).toBe('');
      parseSpy.mockRestore();
    });
  });

  describe('getI18nLink helpers', () => {
    it('should return empty text and href when translation has no anchor tags', () => {
      expect(getI18nLink('app.name')).toEqual({ text: '', href: '' });
      expect(getI18nLinkText('app.name')).toBe('');
      expect(getI18nLinkHref('app.name')).toBe('');
    });
  });

  describe('matchI18nPlainText', () => {
    it('should return false if element has no textContent or does not match', () => {
      const matcher = matchI18nPlainText('app.name');
      expect(matcher('content', null)).toBe(false);

      const emptyDiv = document.createElement('div');
      expect(matcher('content', emptyDiv)).toBe(false);

      const differentDiv = document.createElement('div');
      differentDiv.textContent = 'Something completely different';
      expect(matcher('content', differentDiv)).toBe(false);
    });

    it('should match the innermost element and reject parent elements that contain the text in children', () => {
      const matcher = matchI18nPlainText('app.name');

      const parent = document.createElement('div');
      const child = document.createElement('span');
      child.textContent = 'Swiss Tools';
      parent.appendChild(child);

      // Parent contains the text, but has a child that also contains it -> should be false
      expect(matcher('content', parent)).toBe(false);
      // Innermost child contains the text with no children containing it -> should be true
      expect(matcher('content', child)).toBe(true);
    });

    it('should handle child elements having null textContent when checking descendants', () => {
      const matcher = matchI18nPlainText('app.name');

      const parent = document.createElement('div');
      Object.defineProperty(parent, 'textContent', { value: 'Swiss Tools', configurable: true });

      const child = document.createElement('span');
      Object.defineProperty(child, 'textContent', { value: null, configurable: true });
      parent.appendChild(child);

      expect(matcher('content', parent)).toBe(true);
    });
  });
});
