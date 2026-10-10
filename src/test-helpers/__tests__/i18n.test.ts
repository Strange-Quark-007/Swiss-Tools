import { describe, it, expect } from 'vitest';

import { createTestT, testT } from '../i18n';

describe('i18n-test-helper', () => {
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
    // aria.copyContext is "Copy {context}"
    expect(testT('aria.copyContext')).toBe('Copy {context}');
  });

  it('should throw an error when a requested translation key is missing from en-US.json', () => {
    expect(() => testT('non.existent.key')).toThrow('Missing translation key in en-US.json: "non.existent.key"');
  });

  it('should create an independent translation function via createTestT()', () => {
    const customT = createTestT();
    expect(customT('app.name')).toBe('Swiss Tools');
  });
});
