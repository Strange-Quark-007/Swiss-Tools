import { describe, it, expect, vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  getRequestConfig: (fn: unknown) => fn,
}));

import requestConfig from '../request';

describe('i18n request configuration', () => {
  it('should resolve default locale and nested messages dictionary', async () => {
    // next-intl getRequestConfig wraps the loader function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = await (requestConfig as any)({
      requestLocale: Promise.resolve('en-US'),
    });

    expect(config.locale).toBe('en-US');
    expect(config.messages).toBeDefined();
    expect(typeof config.messages).toBe('object');
    // Verify nested keys built by lodash/set (e.g. app.name -> app: { name: ... })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((config.messages as any).app?.name).toBeDefined();
  });
});
