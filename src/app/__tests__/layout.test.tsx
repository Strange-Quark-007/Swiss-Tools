import { render, screen } from '@testing-library/react';
import { headers } from 'next/headers';
import { describe, expect, it, vi } from 'vitest';

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
  it('should generate metadata for root layout', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('app.meta.title'),
      description: testT('app.meta.description'),
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
