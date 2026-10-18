import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { useAppCommand } from '@/components/providers/app-command-provider';
import { useSidebar } from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';
import { useAppStore } from '@/store/store';
import { testT } from '@/test-helpers/i18n';

import { AppNavbar } from '../app-navbar';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/components/ui/sidebar', () => ({
  useSidebar: vi.fn(),
}));

vi.mock('@/components/providers/app-command-provider', () => ({
  useAppCommand: vi.fn(),
}));

vi.mock('@/store/store', () => ({
  useAppStore: vi.fn(),
}));

describe('AppNavbar', () => {
  const mockSetOpenMobile = vi.fn();
  const mockSetOpenCommand = vi.fn();
  const mockSetNavbarTitle = vi.fn();

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
    vi.mocked(useAppStore).mockReturnValue({
      navbarTitle: 'Swiss Tools',
      setNavbarTitle: mockSetNavbarTitle,
    } as unknown as ReturnType<typeof useAppStore>);
  });

  it('should render title heading and search button that opens command palette', () => {
    render(<AppNavbar title="Default Title" />);

    expect(screen.getByRole('heading', { level: 1, hidden: true })).toBeDefined();
    expect(screen.getByText('Swiss Tools')).toBeDefined();

    const searchBtn = screen.getByRole('button', { name: new RegExp(testT('command.placeholder'), 'i') });
    expect(searchBtn).toBeDefined();

    fireEvent.click(searchBtn);
    expect(mockSetOpenCommand).toHaveBeenCalledWith(true);
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

  it('should fallback to title prop when navbarTitle is falsy', () => {
    vi.mocked(useAppStore).mockReturnValue({
      navbarTitle: '',
      setNavbarTitle: mockSetNavbarTitle,
    } as unknown as ReturnType<typeof useAppStore>);

    render(<AppNavbar title="Fallback Title Prop" />);
    expect(screen.getByText('Fallback Title Prop')).toBeDefined();
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
