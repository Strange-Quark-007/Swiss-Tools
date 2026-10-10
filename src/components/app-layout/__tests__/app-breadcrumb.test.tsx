import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { testT } from '@/test-helpers/i18n';

import { AppBreadcrumb } from '../app-breadcrumb';

const mocks = vi.hoisted(() => ({
  dashboardRoute: '/dashboard' as string | undefined,
}));

vi.mock('@/constants/routes', async () => {
  const actual = await vi.importActual<typeof import('@/constants/routes')>('@/constants/routes');
  return {
    ...actual,
    get ROUTES() {
      return {
        ...actual.ROUTES,
        get DASHBOARD() {
          return mocks.dashboardRoute;
        },
      };
    },
  };
});

describe('AppBreadcrumb', () => {
  afterEach(() => {
    mocks.dashboardRoute = '/dashboard';
  });

  it('should render Dashboard root breadcrumb and current page item', async () => {
    const jsx = await AppBreadcrumb({
      items: [{ label: 'Number Converter' }],
    });
    render(jsx);

    const dashboardLinks = screen.getAllByRole('link', { name: testT('dashboard.name') });
    expect(dashboardLinks.length).toBeGreaterThan(0);
    expect(dashboardLinks[0].getAttribute('href')).toBe(ROUTES.DASHBOARD);

    expect(screen.getByText('Number Converter')).toBeDefined();
  });

  it('should render intermediate items with links and ellipses when multiple items provided', async () => {
    const jsx = await AppBreadcrumb({
      items: [{ label: 'Unit Converters', href: '/unit-converter' }, { label: 'Area Converter' }],
    });
    render(jsx);

    expect(screen.getByRole('link', { name: 'Unit Converters' })).toBeDefined();
    expect(screen.getByText('Area Converter')).toBeDefined();
  });

  it('should handle items without href gracefully', async () => {
    const jsx = await AppBreadcrumb({
      items: [{ label: 'Category Without Href' }, { label: 'Current Page' }],
    });
    render(jsx);

    expect(screen.getByText('Category Without Href')).toBeDefined();
    expect(screen.getByText('Current Page')).toBeDefined();
  });

  it('should handle root Dashboard breadcrumb having no href', async () => {
    mocks.dashboardRoute = undefined;
    const jsx = await AppBreadcrumb({
      items: [{ label: 'Number Converter' }],
    });
    render(jsx);

    expect(screen.getAllByText(testT('dashboard.name')).length).toBeGreaterThan(0);
    expect(screen.getByText('Number Converter')).toBeDefined();
  });
});
