import { fireEvent, render, screen } from '@testing-library/react';
import { Binary } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppModuleGroupId } from '@/constants/app-modules';
import { ROUTES } from '@/constants/routes';
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { useAppStore } from '@/store/app-store';
import { testT } from '@/test-helpers/i18n';

import { Category, CategoryItem, CategoryList } from '../category-list';

vi.mock('@/hooks/use-module-navigation', () => ({
  useModuleNavigation: vi.fn(),
}));

describe('Sidebar CategoryList and Category components', () => {
  const mockNavigate = vi.fn();

  const createDragEvent = (type: string, getData: (format: string) => string = () => '') => {
    const dataTransfer = {
      dropEffect: '',
      getData: vi.fn(getData),
    };
    const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });

    return { event, dataTransfer };
  };

  const renderItem = (id: ROUTES = ROUTES.NUMBER_CONVERTER, name = 'Number Converter') => {
    const { container } = render(
      <SidebarProvider>
        <CategoryItem
          groupId={AppModuleGroupId.CONVERTERS}
          id={id}
          name={name}
          description="Convert numbers between bases"
          icon={Binary}
        />
      </SidebarProvider>
    );

    const item = container.querySelector('[data-slot="sidebar-menu-item"]');
    expect(item).not.toBeNull();

    return item as HTMLElement;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as Mock).mockReturnValue(ROUTES.DASHBOARD);
    vi.mocked(useModuleNavigation).mockReturnValue(mockNavigate);
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
      expect(useAppStore.getState().favorites).toEqual([ROUTES.NUMBER_CONVERTER]);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should remove item from favorites when star button clicked on favorited item', () => {
      useAppStore.setState({ favorites: [ROUTES.NUMBER_CONVERTER] });

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
      expect(useAppStore.getState().favorites).toEqual([]);
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

    it('should ignore drag events when magic drop is disabled', () => {
      const item = renderItem();

      const dragEnter = createDragEvent('dragenter');
      fireEvent(item, dragEnter.event);
      expect(dragEnter.event.defaultPrevented).toBe(false);

      const dragOver = createDragEvent('dragover');
      fireEvent(item, dragOver.event);
      expect(dragOver.event.defaultPrevented).toBe(false);
      expect(dragOver.dataTransfer.dropEffect).toBe('');

      const dragLeave = createDragEvent('dragleave');
      fireEvent(item, dragLeave.event);
      expect(dragLeave.event.defaultPrevented).toBe(false);

      const drop = createDragEvent('drop');
      fireEvent(item, drop.event);
      expect(drop.event.defaultPrevented).toBe(false);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should reject drops on denied routes when magic drop is enabled', () => {
      useAppStore.setState({ magicDrop: true });
      const item = renderItem(ROUTES.COLOR_PICKER, 'Color Picker');

      const dragOver = createDragEvent('dragover');
      fireEvent(item, dragOver.event);

      expect(dragOver.event.defaultPrevented).toBe(false);
      expect(dragOver.dataTransfer.dropEffect).toBe('none');
      expect(item.className).not.toContain('ring-1');

      const drop = createDragEvent('drop', () => 'payload');
      fireEvent(item, drop.event);

      expect(drop.event.defaultPrevented).toBe(false);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should track the drag lifecycle and clear the highlight after leaving', () => {
      useAppStore.setState({ magicDrop: true });
      const item = renderItem();

      const firstDragOver = createDragEvent('dragover');
      fireEvent(item, firstDragOver.event);
      expect(firstDragOver.event.defaultPrevented).toBe(true);
      expect(firstDragOver.dataTransfer.dropEffect).toBe('copy');
      expect(item.className).toContain('ring-1');

      const secondDragOver = createDragEvent('dragover');
      fireEvent(item, secondDragOver.event);
      expect(item.className).toContain('ring-1');

      const firstDragEnter = createDragEvent('dragenter');
      fireEvent(item, firstDragEnter.event);
      expect(firstDragEnter.event.defaultPrevented).toBe(true);

      const secondDragEnter = createDragEvent('dragenter');
      fireEvent(item, secondDragEnter.event);

      const firstDragLeave = createDragEvent('dragleave');
      fireEvent(item, firstDragLeave.event);
      expect(firstDragLeave.event.defaultPrevented).toBe(true);
      expect(item.className).toContain('ring-1');

      const secondDragLeave = createDragEvent('dragleave');
      fireEvent(item, secondDragLeave.event);
      expect(item.className).not.toContain('ring-1');
    });

    it('should transfer a plain-text payload and navigate', () => {
      useAppStore.setState({ magicDrop: true });
      const item = renderItem();
      const drop = createDragEvent('drop', (format) => (format === 'text/plain' ? 'plain payload' : ''));

      fireEvent(item, drop.event);

      expect(drop.event.defaultPrevented).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NUMBER_CONVERTER);
    });

    it('should transfer a magic-drop payload when plain text is empty', () => {
      useAppStore.setState({ magicDrop: true });
      const item = renderItem();
      const drop = createDragEvent('drop', (format) => (format === 'application/x-magic-drop' ? 'magic payload' : ''));

      fireEvent(item, drop.event);

      expect(drop.event.defaultPrevented).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NUMBER_CONVERTER);
    });

    it('should not navigate when the drop payload is empty', () => {
      useAppStore.setState({ magicDrop: true });
      const item = renderItem();
      const drop = createDragEvent('drop');

      fireEvent(item, drop.event);

      expect(drop.event.defaultPrevented).toBe(true);
      expect(mockNavigate).not.toHaveBeenCalled();
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
