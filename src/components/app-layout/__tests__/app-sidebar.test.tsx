import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { AppModuleGroupId } from '@/constants/appModules';
import { ROUTES } from '@/constants/routes';
import { useFavorites } from '@/hooks/use-favorites';
import { useIsMobile } from '@/hooks/use-mobile';
import { testT } from '@/test-helpers/i18n';

import { AppSidebar } from '../app-sidebar';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(),
}));

vi.mock('@/hooks/use-favorites', () => ({
  useFavorites: vi.fn(),
}));

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: () => vi.fn(),
}));

const mockUseSidebar = vi.fn(() => ({ open: true }));

vi.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children?: React.ReactNode }) => <aside data-slot="sidebar">{children}</aside>,
  SidebarHeader: ({ children }: { children?: React.ReactNode }) => <header>{children}</header>,
  SidebarContent: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  SidebarFooter: ({ children }: { children?: React.ReactNode }) => <footer>{children}</footer>,
  SidebarTrigger: () => <button>Toggle</button>,
  useSidebar: () => mockUseSidebar(),
}));

vi.mock('@/components/sidebar/category-list', () => ({
  CategoryList: () => <div data-testid="mock-category-list" />,
}));

describe('AppSidebar', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSidebar.mockReturnValue({ open: true });
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (usePathname as Mock).mockReturnValue(ROUTES.DASHBOARD);
    (useIsMobile as Mock).mockReturnValue(false);
    (useFavorites as Mock).mockReturnValue({
      id: AppModuleGroupId.FAVORITES,
      label: 'Favorites',
      items: [],
    });
  });

  it('should return null on home and privacy routes', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.HOME);
    const { container, rerender } = render(<AppSidebar />);
    expect(container.firstChild).toBeNull();

    (usePathname as Mock).mockReturnValue(ROUTES.PRIVACY);
    rerender(<AppSidebar />);
    expect(container.firstChild).toBeNull();
  });

  it('should render sidebar header and logo on dashboard route and navigate home on click', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.DASHBOARD);
    render(<AppSidebar />);

    const appTitle = screen.getByText(testT('app.name'));
    expect(appTitle).toBeDefined();

    fireEvent.click(appTitle);
    expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);

    // Click SwissTools logo icon
    const logoSvg = document.querySelector('svg');
    expect(logoSvg).toBeDefined();
    fireEvent.click(logoSvg!);
    expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('should handle collapsed sidebar when open is false and non-dashboard route', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.NUMBER_CONVERTER);
    mockUseSidebar.mockReturnValue({ open: false });

    render(<AppSidebar />);

    const heading = screen.getByRole('heading', { level: 1, hidden: false });
    expect(heading.className).toContain('opacity-0');
  });

  it('should handle mobile mode where isMobile is true', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.DASHBOARD);
    (useIsMobile as Mock).mockReturnValue(true);

    render(<AppSidebar />);

    expect(screen.getByText(testT('app.name'))).toBeDefined();
  });
});
