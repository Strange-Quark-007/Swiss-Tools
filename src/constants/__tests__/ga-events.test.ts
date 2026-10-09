import { describe, it, expect } from 'vitest';

import { GA_EVENTS } from '../gaEvents';

describe('GA_EVENTS', () => {
  it('should have correct values for each event key', () => {
    expect(GA_EVENTS.AUTO_CHECK).toBe('auto_check');
    expect(GA_EVENTS.AUTO_UNCHECK).toBe('auto_uncheck');
    expect(GA_EVENTS.CLEAR).toBe('clear');
    expect(GA_EVENTS.COMMAND).toBe('command');
    expect(GA_EVENTS.CONVERT).toBe('convert');
    expect(GA_EVENTS.CONVERT_AUTO).toBe('convert_auto');
    expect(GA_EVENTS.COPY_INPUT).toBe('copy_input');
    expect(GA_EVENTS.COPY_RESULT).toBe('copy_result');
    expect(GA_EVENTS.DASHBOARD).toBe('dashboard');
    expect(GA_EVENTS.DOWNLOAD).toBe('download');
    expect(GA_EVENTS.FAV_ADD).toBe('favorite_add');
    expect(GA_EVENTS.FAV_REMOVE).toBe('favorite_remove');
    expect(GA_EVENTS.GENERATE).toBe('generate');
    expect(GA_EVENTS.MINIFY).toBe('minify');
    expect(GA_EVENTS.PAGE_VIEW).toBe('page_view');
    expect(GA_EVENTS.PRETTY).toBe('pretty');
    expect(GA_EVENTS.RESET).toBe('reset');
    expect(GA_EVENTS.SAMPLE).toBe('sample');
    expect(GA_EVENTS.SEARCH).toBe('search');
    expect(GA_EVENTS.SIDEBAR_TOGGLE).toBe('sidebar_toggle');
    expect(GA_EVENTS.SWAP).toBe('swap');
    expect(GA_EVENTS.THEME_TOGGLE).toBe('theme_toggle');
    expect(GA_EVENTS.UPLOAD).toBe('upload');
  });
});
