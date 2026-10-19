import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { appModules } from '@/constants/app-modules';
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { useAppStore } from '@/store/store';
import { testT } from '@/test-helpers/i18n';

import { ModulesList } from '../modules-list';

vi.mock('@/hooks/use-module-navigation', () => ({
  useModuleNavigation: vi.fn(),
}));

vi.mock('@/store/store', () => ({
  useAppStore: vi.fn(),
}));

describe('ModulesList dashboard component', () => {
  const mockNavigate = vi.fn();
  const mockAddFavorite = vi.fn();
  const mockRemoveFavorite = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useModuleNavigation).mockReturnValue(mockNavigate);
    vi.mocked(useAppStore).mockReturnValue({
      favorites: [],
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
    } as unknown as ReturnType<typeof useAppStore>);
  });

  it('should render all module groups and module cards', () => {
    render(<ModulesList />);

    const groups = appModules(testT);
    groups.forEach((group) => {
      expect(screen.getByText(group.label)).toBeDefined();

      group.items.forEach((item) => {
        expect(screen.getByText(item.name)).toBeDefined();
        expect(screen.getByText(item.description)).toBeDefined();
      });
    });
  });

  it('should trigger navigation when clicking on a module card', () => {
    render(<ModulesList />);

    const firstGroup = appModules(testT)[0];
    const firstItem = firstGroup.items[0];

    const card = screen.getByText(firstItem.name).closest('[data-slot="item"]');
    expect(card).not.toBeNull();

    fireEvent.click(card!);

    expect(mockNavigate).toHaveBeenCalledWith(firstItem.id);
  });

  it('should add a module to favorites when clicking favorite button on non-favorite item', () => {
    render(<ModulesList />);

    const firstGroup = appModules(testT)[0];
    const firstItem = firstGroup.items[0];

    const addFavButtons = screen.getAllByLabelText(testT('label.addFavorite'));
    expect(addFavButtons.length).toBeGreaterThan(0);

    fireEvent.click(addFavButtons[0]);

    expect(mockAddFavorite).toHaveBeenCalledWith(firstItem.id);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should remove a module from favorites when clicking favorite button on favorited item', () => {
    const firstGroup = appModules(testT)[0];
    const firstItem = firstGroup.items[0];

    vi.mocked(useAppStore).mockReturnValue({
      favorites: [firstItem.id],
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
    } as unknown as ReturnType<typeof useAppStore>);

    render(<ModulesList />);

    const removeFavButton = screen.getByLabelText(testT('label.removeFavorite'));
    expect(removeFavButton).toBeDefined();

    fireEvent.click(removeFavButton);

    expect(mockRemoveFavorite).toHaveBeenCalledWith(firstItem.id);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
