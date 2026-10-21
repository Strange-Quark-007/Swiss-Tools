import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useAppCommand } from '@/components/providers/app-command-provider';
import { useSidebar } from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';
import { useAppStore } from '@/store/app-store';
import { testT } from '@/test-helpers/i18n';

import { AppNavbar } from '../app-navbar';

vi.mock('@/components/ui/sidebar', () => ({
  useSidebar: vi.fn(),
}));

vi.mock('@/components/providers/app-command-provider', () => ({
  useAppCommand: vi.fn(),
}));

describe('AppNavbar', () => {
  const mockSetOpenMobile = vi.fn();
  const mockSetOpenCommand = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as Mock).mockReturnValue(ROUTES.DASHBOARD);
    vi.mocked(useSidebar).mockReturnValue({
      openMobile: false,
      setOpenMobile: mockSetOpenMobile,
    } as unknown as ReturnType<typeof useSidebar>);
    vi.mocked(useAppCommand).mockReturnValue({
      open: false,
      setOpen: mockSetOpenCommand,
    } as unknown as ReturnType<typeof useAppCommand>);
  });

  it('should render the route title and open the command palette on search click', () => {
    render(<AppNavbar title="Default Title" />);

    expect(screen.getByRole('heading', { level: 1, hidden: true })).toBeDefined();
    expect(screen.getByText(testT('dashboard.name'))).toBeDefined();
    expect(useAppStore.getState().navbarTitle).toBe(testT('dashboard.name'));

    const searchBtn = screen.getByRole('button', { name: new RegExp(testT('command.placeholder'), 'i') });
    expect(searchBtn).toBeDefined();

    fireEvent.click(searchBtn);
    expect(mockSetOpenCommand).toHaveBeenCalledWith(true);
  });

  it('should sync the navbar title with the current route', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.NUMBER_CONVERTER);

    render(<AppNavbar title="Default Title" />);

    expect(useAppStore.getState().navbarTitle).toBe(testT('numberConverter.name'));
    expect(screen.getByText(testT('numberConverter.name'))).toBeDefined();
  });

  it('should fall back to the title prop before the route title resolves', () => {
    // Server rendering skips effects, mirroring the first paint before the
    // navbar derives the title from the pathname.
    const html = renderToString(<AppNavbar title="Fallback Title Prop" />);

    expect(html).toContain('Fallback Title Prop');
  });

  it('should toggle mobile menu when mobile menu button is clicked', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.NUMBER_CONVERTER);
    vi.mocked(useSidebar).mockReturnValue({
      openMobile: false,
      setOpenMobile: mockSetOpenMobile,
    } as unknown as ReturnType<typeof useSidebar>);

    render(<AppNavbar title="Number Converter" />);

    // Mobile menu trigger icon is rendered on non-home paths
    const menuIcons = document.querySelectorAll('.lucide-menu');
    expect(menuIcons.length).toBeGreaterThan(0);

    fireEvent.click(menuIcons[0]);
    expect(mockSetOpenMobile).toHaveBeenCalledWith(true);
  });

  it('should render close X icon when openMobile is true', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.NUMBER_CONVERTER);
    vi.mocked(useSidebar).mockReturnValue({
      openMobile: true,
      setOpenMobile: mockSetOpenMobile,
    } as unknown as ReturnType<typeof useSidebar>);

    render(<AppNavbar title="Number Converter" />);

    const closeIcons = document.querySelectorAll('.lucide-x');
    expect(closeIcons.length).toBeGreaterThan(0);
  });

  it('should hide mobile menu button and set aria-hidden on Home and Privacy paths', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.HOME);
    const { rerender } = render(<AppNavbar title="Home" />);

    expect(document.querySelector('.lucide-menu')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, hidden: true }).getAttribute('aria-hidden')).toBe('true');

    (usePathname as Mock).mockReturnValue(ROUTES.PRIVACY);
    rerender(<AppNavbar title="Privacy" />);
    expect(screen.getByRole('heading', { level: 1, hidden: true }).getAttribute('aria-hidden')).toBe('true');

    (usePathname as Mock).mockReturnValue(ROUTES.NUMBER_CONVERTER);
    rerender(<AppNavbar title="Converter" />);
    expect(screen.getByRole('heading', { level: 1, hidden: false }).getAttribute('aria-hidden')).toBe('false');
  });

  it('should reset openMobile to false on pathname change', () => {
    render(<AppNavbar title="Title" />);
    expect(mockSetOpenMobile).toHaveBeenCalledWith(false);
  });
});
