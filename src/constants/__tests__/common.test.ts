import { describe, expect, it } from 'vitest';

import {
  customScrollbarCss,
  DATA_RETENTION_MODE,
  GITHUB_URL,
  LOCALE,
  MIME_TYPE,
  SEARCH_PARAM_KEYS,
  TOOLTIP_TYPE,
} from '../common';

describe('common constants', () => {
  it('should define expected scalar constants', () => {
    expect(LOCALE).toBe('en-US');
    expect(GITHUB_URL).toBe('https://github.com/Strange-Quark-007/Swiss-Tools');
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
    expect(SEARCH_PARAM_KEYS.PATTERN).toBe('pattern');
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

  it('should define valid DATA_RETENTION_MODE enum values', () => {
    expect(DATA_RETENTION_MODE.STRICT).toBe('strict');
    expect(DATA_RETENTION_MODE.SESSION).toBe('session');
  });
});
