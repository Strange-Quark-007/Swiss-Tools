import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { AppModuleGroupId } from '@/constants/app-modules';
import { GA_EVENTS } from '@/constants/ga-events';
import { ROUTES } from '@/constants/routes';
import { MAGIC_DROP_MIME_TYPE } from '@/experiments/magic-drop/transfer-data';
import { useFavorites } from '@/hooks/use-favorites';
import { useTrackEvent } from '@/hooks/use-ga-events';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePreferencesStore } from '@/store/preferences-store';
import { testT } from '@/test-helpers/i18n';

import { AppSidebar } from '../app-sidebar';

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(),
}));

vi.mock('@/hooks/use-favorites', () => ({
  useFavorites: vi.fn(),
}));

const mockSetOpen = vi.fn();
const mockUseSidebar = vi.fn(() => ({ open: true, setOpen: mockSetOpen }));

vi.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children?: React.ReactNode }) => <aside data-slot="sidebar">{children}</aside>,
  SidebarHeader: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <header data-testid="sidebar-header" {...props}>
      {children}
    </header>
  ),
  SidebarContent: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="sidebar-content" {...props}>
      {children}
    </div>
  ),
  SidebarFooter: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <footer data-testid="sidebar-footer" {...props}>
      {children}
    </footer>
  ),
  SidebarTrigger: ({ onClick }: { onClick?: () => void }) => (
    <button data-testid="sidebar-trigger" onClick={onClick}>
      Toggle
    </button>
  ),
  useSidebar: () => mockUseSidebar(),
}));

vi.mock('@/components/sidebar/category-list', () => ({
  CategoryList: () => <div data-testid="mock-category-list" />,
}));

describe('AppSidebar', () => {
  const mockPush = vi.fn();
  const mockTrackEvent = vi.fn();

  let rafCallbacks: Map<number, FrameRequestCallback>;
  let rafId: number;
  let cancelAnimationFrameSpy: ReturnType<typeof vi.fn>;

  const setSidebarRect = (element: HTMLElement) => {
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 300,
      left: 0,
      right: 100,
      width: 100,
      height: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
  };

  const renderSidebarContent = () => {
    render(<AppSidebar />);
    const content = screen.getByTestId('sidebar-content');
    setSidebarRect(content);

    return content;
  };

  const createDragEvent = (type: string, props: Record<string, unknown> = {}) => {
    const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent;
    Object.assign(event, { dataTransfer: { dropEffect: '' }, ...props });

    return event;
  };

  const createTextDragEvent = (type: string) =>
    createDragEvent(type, {
      dataTransfer: { dropEffect: '', types: [MAGIC_DROP_MIME_TYPE, 'text/plain'] },
    });

  const renderCollapsedSidebar = () => {
    mockUseSidebar.mockReturnValue({ open: false, setOpen: mockSetOpen });
    render(<AppSidebar />);

    return screen.getByTestId('sidebar-content');
  };

  const runNextRaf = () => {
    const next = [...rafCallbacks.entries()][0];
    if (!next) throw new Error('No pending animation frame');

    const [id, callback] = next;
    rafCallbacks.delete(id);
    callback(0);
  };

  const getPendingRaf = () => {
    const next = [...rafCallbacks.values()][0];
    if (!next) throw new Error('No pending animation frame');

    return next;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTrackEvent).mockReturnValue(mockTrackEvent);
    mockUseSidebar.mockReturnValue({ open: true, setOpen: mockSetOpen });
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (usePathname as Mock).mockReturnValue(ROUTES.DASHBOARD);
    (useIsMobile as Mock).mockReturnValue(false);
    (useFavorites as Mock).mockReturnValue({
      id: AppModuleGroupId.FAVORITES,
      label: 'Favorites',
      items: [],
    });

    rafCallbacks = new Map();
    rafId = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafId += 1;
      rafCallbacks.set(rafId, callback);

      return rafId;
    });
    cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null on home, privacy, preferences, and labs routes', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.HOME);
    const { container, rerender } = render(<AppSidebar />);
    expect(container.firstChild).toBeNull();

    (usePathname as Mock).mockReturnValue(ROUTES.PRIVACY);
    rerender(<AppSidebar />);
    expect(container.firstChild).toBeNull();

    (usePathname as Mock).mockReturnValue(ROUTES.PREFERENCES);
    rerender(<AppSidebar />);
    expect(container.firstChild).toBeNull();

    (usePathname as Mock).mockReturnValue(ROUTES.LABS);
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
    mockUseSidebar.mockReturnValue({ open: false, setOpen: mockSetOpen });

    render(<AppSidebar />);

    const heading = screen.getByRole('heading', { level: 1, hidden: false });
    expect(heading).toBeDefined();
  });

  it('should handle mobile mode where isMobile is true', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.DASHBOARD);
    (useIsMobile as Mock).mockReturnValue(true);

    render(<AppSidebar />);

    expect(screen.getByText(testT('app.name'))).toBeDefined();
  });

  it('should track sidebar toggle event when SidebarTrigger is clicked', () => {
    (usePathname as Mock).mockReturnValue(ROUTES.DASHBOARD);
    render(<AppSidebar />);

    const trigger = screen.getByTestId('sidebar-trigger');
    fireEvent.click(trigger);
    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.SIDEBAR_TOGGLE);
  });

  it('should ignore drag over events when magic drop is disabled', () => {
    const content = renderSidebarContent();
    const dragOver = createDragEvent('dragover', { clientY: 10 });

    fireEvent(content, dragOver);

    expect(dragOver.defaultPrevented).toBe(false);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should auto-scroll upward near the top edge and stop in the middle', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    const content = renderSidebarContent();
    content.scrollTop = 100;

    const dragOverTop = createDragEvent('dragover', { clientY: 10 });
    fireEvent(content, dragOverTop);

    expect(dragOverTop.defaultPrevented).toBe(true);
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

    runNextRaf();
    expect(content.scrollTop).toBe(91);
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);

    const secondDragOverTop = createDragEvent('dragover', { clientY: 5 });
    fireEvent(content, secondDragOverTop);
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);

    const pendingRaf = getPendingRaf();
    const dragOverMiddle = createDragEvent('dragover', { clientY: 150 });
    fireEvent(content, dragOverMiddle);

    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(2);

    // A cancelled frame should not continue scrolling if it still fires.
    pendingRaf(0);
    expect(content.scrollTop).toBe(91);
  });

  it('should auto-scroll downward near the bottom edge', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    const content = renderSidebarContent();
    content.scrollTop = 0;

    const dragOverBottom = createDragEvent('dragover', { clientY: 290 });
    fireEvent(content, dragOverBottom);

    expect(dragOverBottom.defaultPrevented).toBe(true);
    runNextRaf();
    expect(content.scrollTop).toBe(9);
  });

  it('should stop auto-scrolling only when the pointer leaves the sidebar', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    const content = renderSidebarContent();
    const child = document.createElement('span');
    content.appendChild(child);

    fireEvent(content, createDragEvent('dragover', { clientY: 10 }));
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

    fireEvent(content, createDragEvent('dragleave', { relatedTarget: child }));
    expect(cancelAnimationFrameSpy).not.toHaveBeenCalled();

    fireEvent(content, createDragEvent('dragleave', { relatedTarget: document.body }));
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should stop auto-scrolling on drop and global drag end events', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    const content = renderSidebarContent();

    fireEvent(content, createDragEvent('dragover', { clientY: 10 }));
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

    const drop = createDragEvent('drop');
    fireEvent(content, drop);
    expect(drop.defaultPrevented).toBe(true);
    expect(cancelAnimationFrameSpy).toHaveBeenCalledTimes(1);

    fireEvent(window, createDragEvent('dragend'));
    expect(cancelAnimationFrameSpy).toHaveBeenCalledTimes(1);
  });

  it('should expand the collapsed rail once when a Magic Drop drag enters it', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    const content = renderCollapsedSidebar();

    fireEvent(content, createTextDragEvent('dragenter'));

    expect(mockSetOpen).toHaveBeenCalledTimes(1);
    expect(mockSetOpen).toHaveBeenCalledWith(true);

    fireEvent(screen.getByTestId('sidebar-header'), createTextDragEvent('dragenter'));
    fireEvent(screen.getByTestId('sidebar-footer'), createTextDragEvent('dragenter'));

    expect(mockSetOpen).toHaveBeenCalledTimes(1);
  });

  it('should restore the collapsed rail when the drag enters another element', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    const content = renderCollapsedSidebar();

    fireEvent(content, createTextDragEvent('dragenter'));
    expect(mockSetOpen).toHaveBeenLastCalledWith(true);

    fireEvent(document.body, createTextDragEvent('dragenter'));
    expect(mockSetOpen).toHaveBeenLastCalledWith(false);

    fireEvent(content, createTextDragEvent('dragenter'));
    expect(mockSetOpen.mock.calls).toEqual([[true], [false], [true]]);
  });

  it('should keep the rail expanded while the drag stays inside it', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    renderCollapsedSidebar();

    fireEvent(screen.getByTestId('sidebar-content'), createTextDragEvent('dragenter'));
    fireEvent(screen.getByTestId('sidebar-header'), createTextDragEvent('dragenter'));
    fireEvent(screen.getByTestId('sidebar-footer'), createTextDragEvent('dragenter'));

    expect(mockSetOpen.mock.calls).toEqual([[true]]);
  });

  it('should restore the collapsed rail on every drag end', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    const content = renderCollapsedSidebar();

    fireEvent(content, createTextDragEvent('dragenter'));
    fireEvent(window, createDragEvent('dragend'));
    expect(mockSetOpen).toHaveBeenLastCalledWith(false);

    fireEvent(content, createTextDragEvent('dragenter'));
    fireEvent(window, createDragEvent('drop'));
    expect(mockSetOpen).toHaveBeenLastCalledWith(false);
    expect(mockSetOpen.mock.calls).toEqual([[true], [false], [true], [false]]);
  });

  it('should leave the rail collapsed while Magic Drop is disabled', () => {
    const content = renderCollapsedSidebar();

    fireEvent(content, createTextDragEvent('dragenter'));

    expect(mockSetOpen).not.toHaveBeenCalled();
  });

  it('should ignore drags that carry no text payload', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    const content = renderCollapsedSidebar();

    fireEvent(content, createDragEvent('dragenter', { dataTransfer: { dropEffect: '', types: ['Files'] } }));

    expect(mockSetOpen).not.toHaveBeenCalled();
  });

  it('should leave an expanded rail untouched by drags', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    render(<AppSidebar />);

    fireEvent(screen.getByTestId('sidebar-content'), createTextDragEvent('dragenter'));

    expect(mockSetOpen).not.toHaveBeenCalled();
  });

  it('should leave the mobile rail collapsed', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    (useIsMobile as Mock).mockReturnValue(true);
    const content = renderCollapsedSidebar();

    fireEvent(content, createTextDragEvent('dragenter'));

    expect(mockSetOpen).not.toHaveBeenCalled();
  });
});
