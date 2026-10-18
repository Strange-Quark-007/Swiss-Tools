import { fireEvent, render, screen } from '@testing-library/react';
import { Binary } from 'lucide-react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AppModuleGroupId } from '@/constants/app-modules';
import { GA_EVENTS } from '@/constants/ga-events';
import { ROUTES } from '@/constants/routes';
import { useFavorites } from '@/hooks/use-favorites';
import { useTrackEvent } from '@/hooks/use-ga-events';
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { testT } from '@/test-helpers/i18n';

import { AppCommand } from '../app-command';

vi.mock('@/hooks/use-module-navigation', () => ({
  useModuleNavigation: vi.fn(),
}));

vi.mock('@/hooks/use-favorites', () => ({
  useFavorites: vi.fn(),
}));

describe('AppCommand', () => {
  const mockSetOpen = vi.fn();
  const mockTrackEvent = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTrackEvent).mockReturnValue(mockTrackEvent);
    vi.mocked(useModuleNavigation).mockReturnValue(mockNavigate);
    vi.mocked(useFavorites).mockReturnValue({
      id: AppModuleGroupId.FAVORITES,
      label: 'Favorites',
      items: [],
    });
  });

  it('should render dialog when open is true with command input and groups', () => {
    render(<AppCommand open={true} setOpen={mockSetOpen} />);

    expect(screen.getByPlaceholderText(testT('command.placeholder'))).toBeDefined();
    expect(screen.getAllByText(testT('dashboard.name')).length).toBeGreaterThan(0);
  });

  it('should listen for Ctrl+K and Cmd+K keyboard shortcut to open command dialog', () => {
    render(<AppCommand open={false} setOpen={mockSetOpen} />);

    // Non-matching keys
    fireEvent.keyDown(window, { key: 'j', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'k', ctrlKey: false, metaKey: false });
    expect(mockSetOpen).not.toHaveBeenCalled();

    // Ctrl+K
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.COMMAND);
    expect(mockSetOpen).toHaveBeenCalledWith(true);

    vi.clearAllMocks();

    // Meta+K
    fireEvent.keyDown(window, { key: 'K', metaKey: true });
    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.COMMAND);
    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });

  it('should render items with shortcut when present', () => {
    vi.mocked(useFavorites).mockReturnValue({
      id: AppModuleGroupId.FAVORITES,
      label: 'Favorites',
      items: [
        {
          id: ROUTES.NUMBER_CONVERTER,
          name: 'Number Converter',
          description: 'desc',
          icon: Binary,
          shortcut: '⌘+1',
        },
      ],
    });

    render(<AppCommand open={true} setOpen={mockSetOpen} />);

    expect(screen.getByText('⌘+1')).toBeDefined();
  });

  it('should handle item selection by closing dialog and navigating to route', () => {
    render(<AppCommand open={true} setOpen={mockSetOpen} />);

    const dashboardItems = screen.getAllByText(testT('dashboard.name'));
    fireEvent.click(dashboardItems[dashboardItems.length - 1]);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
  });
});
