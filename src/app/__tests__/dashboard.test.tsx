import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import DashboardPage, { generateMetadata } from '../dashboard/page';

vi.mock('@/dashboard/dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard-component" />,
}));

vi.mock('@/components/app-layout/app-footer', () => ({
  Footer: () => <div data-testid="footer-component" />,
}));

describe('Dashboard page (app/dashboard/page.tsx)', () => {
  it('should generate metadata for dashboard page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('dashboard.meta.title'));
    expect(metadata.description).toBe(testT('dashboard.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('dashboard.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('dashboard.meta.title'));
  });

  it('should render Dashboard and Footer components', async () => {
    const jsx = await DashboardPage();
    render(jsx);

    expect(screen.getByTestId('dashboard-component')).toBeDefined();
    expect(screen.getByTestId('footer-component')).toBeDefined();
  });
});
