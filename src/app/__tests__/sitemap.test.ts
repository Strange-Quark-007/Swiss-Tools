import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { appModules } from '@/constants/app-modules';
import { testT } from '@/test-helpers/i18n';

import sitemap from '../sitemap';

const DUMMY_BASE_URL = 'https://example.com';

describe('sitemap', () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = DUMMY_BASE_URL;
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
  });

  it('should generate sitemap entries for all static and module routes', async () => {
    const entries = await sitemap();

    expect(entries.length).toBeGreaterThan(0);

    // Static routes
    const home = entries.find((e) => e.url === `${DUMMY_BASE_URL}/`);
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1);
    expect(home?.changeFrequency).toBe('weekly');
    expect(home?.lastModified).toBeInstanceOf(Date);

    const dashboard = entries.find((e) => e.url === `${DUMMY_BASE_URL}/dashboard`);
    expect(dashboard).toBeDefined();
    expect(dashboard?.priority).toBe(0.9);
    expect(dashboard?.changeFrequency).toBe('weekly');

    const privacy = entries.find((e) => e.url === `${DUMMY_BASE_URL}/privacy`);
    expect(privacy).toBeDefined();
    expect(privacy?.priority).toBe(0.6);
    expect(privacy?.changeFrequency).toBe('monthly');

    const preferences = entries.find((e) => e.url === `${DUMMY_BASE_URL}/preferences`);
    expect(preferences).toBeDefined();
    expect(preferences?.priority).toBe(0.5);
    expect(preferences?.changeFrequency).toBe('monthly');

    const labs = entries.find((e) => e.url === `${DUMMY_BASE_URL}/labs`);
    expect(labs).toBeDefined();
    expect(labs?.priority).toBe(0.5);
    expect(labs?.changeFrequency).toBe('monthly');

    // Dynamic module routes
    const dynamicItems = appModules(testT).flatMap((group) => group.items);
    dynamicItems.forEach((item) => {
      const match = entries.find((e) => e.url === `${DUMMY_BASE_URL}${item.id}`);
      expect(match).toBeDefined();
      expect(match?.priority).toBe(0.8);
      expect(match?.changeFrequency).toBe('monthly');
    });

    // Total count = 5 static + dynamic items
    expect(entries.length).toBe(5 + dynamicItems.length);
  });
});
