import { render, screen } from '@testing-library/react';
import { headers } from 'next/headers';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { APP_NAME, CREATOR_NAME } from '@/constants/common';
import { DEFAULT_APP_KEYWORDS } from '@/constants/seo';
import { testT } from '@/test-helpers/i18n';

import RootLayout, { generateMetadata } from '../layout';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: (key: string) => (key === 'x-pathname' ? '/case-converter' : null),
  }),
}));

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockResolvedValue('en-US'),
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => <div data-testid="analytics" />,
}));

vi.mock('@/components/app-layout/app-navbar', () => ({
  AppNavbar: ({ title }: { title: string }) => <header data-testid="app-navbar">{title}</header>,
}));

vi.mock('@/components/app-layout/app-sidebar', () => ({
  AppSidebar: () => <aside data-testid="app-sidebar" />,
}));

vi.mock('@/components/providers/cookie-consent-provider', () => ({
  CookieConsentProvider: () => <div data-testid="cookie-consent" />,
}));

vi.mock('@/components/providers/view-transition-provider', () => ({
  ViewTransitionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/theme/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/providers/app-command-provider', () => ({
  AppCommandProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/providers/register-stores', () => ({
  RegisterStores: () => <div data-testid="register-stores" />,
}));

vi.mock('@/components/providers/ga-page-view-tracker', () => ({
  GAPageViewTracker: () => <div data-testid="ga-tracker" />,
}));

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe('RootLayout (app/layout.tsx)', () => {
  describe('generateMetadata', () => {
    const originalEnv = process.env.NEXT_PUBLIC_BASE_URL;

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.NEXT_PUBLIC_BASE_URL = originalEnv;
      } else {
        delete process.env.NEXT_PUBLIC_BASE_URL;
      }
    });

    it('should generate metadata for root layout when NEXT_PUBLIC_BASE_URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_BASE_URL;
      const metadata = await generateMetadata();

      expect(metadata.metadataBase).toBeUndefined();
      expect(metadata.title).toEqual({ default: testT('app.meta.title'), template: '%s' });
      expect(metadata.description).toBe(testT('app.meta.description'));
      expect(metadata.applicationName).toBe(APP_NAME);
      expect(metadata.creator).toBe(CREATOR_NAME);
      expect(metadata.keywords).toEqual(DEFAULT_APP_KEYWORDS);
      expect(metadata.openGraph?.title).toBe(testT('app.meta.title'));
      expect(metadata.twitter?.title).toBe(testT('app.meta.title'));
    });

    it('should include metadataBase when NEXT_PUBLIC_BASE_URL is a valid URL', async () => {
      const dummyUrl = 'https://example.com';
      process.env.NEXT_PUBLIC_BASE_URL = dummyUrl;
      const metadata = await generateMetadata();

      expect(metadata.metadataBase).toEqual(new URL(dummyUrl));
      expect(metadata.alternates?.canonical).toBe(dummyUrl);
      expect(metadata.openGraph?.url).toBe(dummyUrl);
    });

    it('should handle invalid URL in NEXT_PUBLIC_BASE_URL gracefully without setting metadataBase', async () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'not-a-valid-url';
      const metadata = await generateMetadata();

      expect(metadata.metadataBase).toBeUndefined();
    });
  });

  it('should render layout shell with navigation, sidebar, and children', async () => {
    const jsx = await RootLayout({
      children: <div data-testid="test-child">Child Content</div>,
    });
    render(jsx, { container: document });

    expect(screen.getByTestId('test-child')).toBeDefined();
    expect(screen.getByTestId('app-navbar')).toBeDefined();
    expect(screen.getByTestId('app-sidebar')).toBeDefined();
    expect(screen.getByTestId('analytics')).toBeDefined();
    expect(screen.getByTestId('toaster')).toBeDefined();
  });

  it('should handle missing x-pathname header', async () => {
    vi.mocked(headers).mockResolvedValueOnce({
      get: () => null,
    } as unknown as Awaited<ReturnType<typeof headers>>);

    const jsx = await RootLayout({
      children: <div data-testid="test-child">Child Content</div>,
    });
    render(jsx, { container: document });

    expect(screen.getByTestId('app-navbar')).toBeDefined();
  });
});
