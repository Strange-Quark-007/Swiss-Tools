import { describe, expect, it } from 'vitest';

import robots from '../robots';

describe('robots (app/robots.ts)', () => {
  it('should return valid robots configuration with sitemap directive', () => {
    const config = robots();

    expect(config.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(config.sitemap).toBeDefined();
    expect(String(config.sitemap)).toContain('/sitemap.xml');
  });
});
