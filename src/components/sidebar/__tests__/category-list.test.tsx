import { fireEvent, render, screen } from '@testing-library/react';
import { Binary } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppModuleGroupId } from '@/constants/appModules';
import { ROUTES } from '@/constants/routes';
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { useAppStore } from '@/store/store';
import { testT } from '@/test-helpers/i18n';

import { Category, CategoryItem, CategoryList } from '../category-list';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/hooks/use-module-navigation', () => ({
  useModuleNavigation: vi.fn(),
}));

vi.mock('@/store/store', () => ({
  useAppStore: vi.fn(),
}));

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: () => vi.fn(),
}));

describe('Sidebar CategoryList and Category components', () => {
  const mockNavigate = vi.fn();
  const mockAddFavorite = vi.fn();
  const mockRemoveFavorite = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as Mock).mockReturnValue(ROUTES.DASHBOARD);
    vi.mocked(useModuleNavigation).mockReturnValue(mockNavigate);
    vi.mocked(useAppStore).mockReturnValue({
      favorites: [],
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
    } as unknown as ReturnType<typeof useAppStore>);
  });

  describe('CategoryItem', () => {
    it('should render item and trigger navigation on click', () => {
      render(
        <SidebarProvider>
          <CategoryItem
            groupId={AppModuleGroupId.CONVERTERS}
            id={ROUTES.NUMBER_CONVERTER}
            name="Number Converter"
            description="Convert numbers between bases"
            icon={Binary}
            tag="NEW"
          />
        </SidebarProvider>
      );

      expect(screen.getByText('Number Converter')).toBeDefined();
      expect(screen.getByText('NEW')).toBeDefined();

      const itemButton = screen.getByText('Number Converter');
      fireEvent.click(itemButton);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NUMBER_CONVERTER);
    });

    it('should add item to favorites when star button clicked on un-favorited item', () => {
      render(
        <SidebarProvider>
          <CategoryItem
            groupId={AppModuleGroupId.CONVERTERS}
            id={ROUTES.NUMBER_CONVERTER}
            name="Number Converter"
            description="Convert numbers between bases"
            icon={Binary}
          />
        </SidebarProvider>
      );

      const favButton = screen.getByLabelText(`${testT('label.addFavorite')} Number Converter`);
      expect(favButton).toBeDefined();

      fireEvent.click(favButton);
      expect(mockAddFavorite).toHaveBeenCalledWith(ROUTES.NUMBER_CONVERTER);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should remove item from favorites when star button clicked on favorited item', () => {
      vi.mocked(useAppStore).mockReturnValue({
        favorites: [ROUTES.NUMBER_CONVERTER],
        addFavorite: mockAddFavorite,
        removeFavorite: mockRemoveFavorite,
      } as unknown as ReturnType<typeof useAppStore>);

      render(
        <SidebarProvider>
          <CategoryItem
            groupId={AppModuleGroupId.CONVERTERS}
            id={ROUTES.NUMBER_CONVERTER}
            name="Number Converter"
            description="Convert numbers between bases"
            icon={Binary}
          />
        </SidebarProvider>
      );

      const favButton = screen.getByLabelText(`${testT('label.removeFavorite')} Number Converter`);
      expect(favButton).toBeDefined();

      fireEvent.click(favButton);
      expect(mockRemoveFavorite).toHaveBeenCalledWith(ROUTES.NUMBER_CONVERTER);
    });

    it('should hide favorite star button for Dashboard route', () => {
      render(
        <SidebarProvider>
          <CategoryItem
            groupId={AppModuleGroupId.DASHBOARD}
            id={ROUTES.DASHBOARD}
            name="Dashboard"
            description="Dashboard overview"
            icon={Binary}
          />
        </SidebarProvider>
      );

      expect(screen.queryByLabelText(new RegExp(testT('label.addFavorite')))).toBeNull();
    });
  });

  describe('Category and CategoryList', () => {
    it('should render Category with group label and items', () => {
      render(
        <SidebarProvider>
          <Category
            id={AppModuleGroupId.CONVERTERS}
            label="Converters"
            items={[
              {
                id: ROUTES.NUMBER_CONVERTER,
                name: 'Number Converter',
                description: 'Convert numbers between bases',
                icon: Binary,
              },
            ]}
          />
        </SidebarProvider>
      );

      expect(screen.getByText('Converters')).toBeDefined();
      expect(screen.getByText('Number Converter')).toBeDefined();

      const triggers = screen.getAllByRole('button', { name: 'Converters' });
      expect(triggers.length).toBeGreaterThan(0);
      triggers.forEach((trigger) => {
        expect(trigger.getAttribute('aria-label') || trigger.textContent).toContain('Converters');
      });
    });

    it('should return null when group has no items', () => {
      const { container } = render(
        <SidebarProvider>
          <Category id={AppModuleGroupId.CONVERTERS} label="Empty Converters" items={[]} />
        </SidebarProvider>
      );

      expect(container.querySelector('[data-slot="sidebar-group"]')).toBeNull();
    });

    it('should render full CategoryList with multiple groups', () => {
      render(
        <SidebarProvider>
          <CategoryList
            groups={[
              {
                id: AppModuleGroupId.CONVERTERS,
                label: 'Converters Group',
                items: [
                  {
                    id: ROUTES.NUMBER_CONVERTER,
                    name: 'Number Converter',
                    description: 'Convert numbers between bases',
                    icon: Binary,
                  },
                ],
              },
            ]}
          />
        </SidebarProvider>
      );

      expect(screen.getByText('Converters Group')).toBeDefined();
      expect(screen.getByText('Number Converter')).toBeDefined();
    });
  });
});
