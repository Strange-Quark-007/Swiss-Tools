import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { AppModuleGroupId } from '@/constants/app-modules';
import { GA_EVENTS } from '@/constants/ga-events';
import { ROUTES } from '@/constants/routes';
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

const mockUseSidebar = vi.fn(() => ({ open: true }));

vi.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children?: React.ReactNode }) => <aside data-slot="sidebar">{children}</aside>,
  SidebarHeader: ({ children }: { children?: React.ReactNode }) => <header>{children}</header>,
  SidebarContent: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="sidebar-content" {...props}>
      {children}
    </div>
  ),
  SidebarFooter: ({ children }: { children?: React.ReactNode }) => <footer>{children}</footer>,
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
    mockUseSidebar.mockReturnValue({ open: true });
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
    usePreferencesStore.setState({ labs: { magicDrop: true } });
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
    usePreferencesStore.setState({ labs: { magicDrop: true } });
    const content = renderSidebarContent();
    content.scrollTop = 0;

    const dragOverBottom = createDragEvent('dragover', { clientY: 290 });
    fireEvent(content, dragOverBottom);

    expect(dragOverBottom.defaultPrevented).toBe(true);
    runNextRaf();
    expect(content.scrollTop).toBe(9);
  });

  it('should stop auto-scrolling only when the pointer leaves the sidebar', () => {
    usePreferencesStore.setState({ labs: { magicDrop: true } });
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
    usePreferencesStore.setState({ labs: { magicDrop: true } });
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
});
