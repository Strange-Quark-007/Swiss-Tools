import { describe, it, expect } from 'vitest';

import { customScrollbarCss, githubUrl, LOCALE, MIME_TYPE, SEARCH_PARAM_KEYS, TOOLTIP_TYPE } from '../common';

describe('common constants', () => {
  it('should define expected scalar constants', () => {
    expect(LOCALE).toBe('en-US');
    expect(githubUrl).toBe('https://github.com/Strange-Quark-007/Swiss-Tools');
    expect(customScrollbarCss).toContain('scrollbar-custom');
  });

  it('should define valid SEARCH_PARAM_KEYS enum values', () => {
    expect(SEARCH_PARAM_KEYS.FROM).toBe('from');
    expect(SEARCH_PARAM_KEYS.TO).toBe('to');
    expect(SEARCH_PARAM_KEYS.CODEC).toBe('codec');
    expect(SEARCH_PARAM_KEYS.MODE).toBe('mode');
    expect(SEARCH_PARAM_KEYS.ALGO).toBe('algo');
    expect(SEARCH_PARAM_KEYS.ENCODING).toBe('encoding');
    expect(SEARCH_PARAM_KEYS.TYPE).toBe('type');
  });

  it('should define valid TOOLTIP_TYPE enum values', () => {
    expect(TOOLTIP_TYPE.info).toBe('info');
    expect(TOOLTIP_TYPE.warning).toBe('warning');
    expect(TOOLTIP_TYPE.error).toBe('error');
  });

  it('should define valid MIME_TYPE enum values', () => {
    expect(MIME_TYPE.TEXT).toBe('text/plain');
    expect(MIME_TYPE.JSON).toBe('application/json');
    expect(MIME_TYPE.XML).toBe('application/xml');
    expect(MIME_TYPE.YAML).toBe('application/x-yaml');
    expect(MIME_TYPE.TOML).toBe('application/toml');
    expect(MIME_TYPE.CSV).toBe('text/csv');
  });
});
