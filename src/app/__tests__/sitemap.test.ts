import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

import { appModules } from '@/constants/appModules';
import { testT } from '@/test-helpers/i18n';

import sitemap from '../sitemap';

vi.mock('@/i18n/utils', () => ({
  getT: vi.fn(async () => ({ t: testT, richT: vi.fn() })),
}));

describe('sitemap', () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://swisstools.dev';
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
  });

  it('should generate sitemap entries for all static and module routes', async () => {
    const entries = await sitemap();

    expect(entries.length).toBeGreaterThan(0);

    // Static routes
    const home = entries.find((e) => e.url === 'https://swisstools.dev/');
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1);
    expect(home?.changeFrequency).toBe('weekly');
    expect(home?.lastModified).toBeInstanceOf(Date);

    const dashboard = entries.find((e) => e.url === 'https://swisstools.dev/dashboard');
    expect(dashboard).toBeDefined();
    expect(dashboard?.priority).toBe(0.9);
    expect(dashboard?.changeFrequency).toBe('weekly');

    const privacy = entries.find((e) => e.url === 'https://swisstools.dev/privacy');
    expect(privacy).toBeDefined();
    expect(privacy?.priority).toBe(0.6);
    expect(privacy?.changeFrequency).toBe('monthly');

    // Dynamic module routes
    const dynamicItems = appModules(testT).flatMap((group) => group.items);
    dynamicItems.forEach((item) => {
      const match = entries.find((e) => e.url === `https://swisstools.dev${item.id}`);
      expect(match).toBeDefined();
      expect(match?.priority).toBe(0.8);
      expect(match?.changeFrequency).toBe('monthly');
    });

    // Total count = 3 static + dynamic items
    expect(entries.length).toBe(3 + dynamicItems.length);
  });
});
