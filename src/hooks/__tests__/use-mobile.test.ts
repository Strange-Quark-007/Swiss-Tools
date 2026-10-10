import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useIsMobile } from '../use-mobile';

describe('useIsMobile', () => {
  let listeners: Array<() => void> = [];
  const originalInnerWidth = window.innerWidth;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    listeners = [];
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event: string, handler: () => void) => {
        listeners.push(handler);
      }),
      removeEventListener: vi.fn((_event: string, handler: () => void) => {
        listeners = listeners.filter((l) => l !== handler);
      }),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.matchMedia = originalMatchMedia;
  });

  it('should return true when viewport width is below mobile breakpoint (< 768px)', () => {
    window.innerWidth = 500;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should return false when viewport width is at or above mobile breakpoint (>= 768px)', () => {
    window.innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should update value and notify subscribers when media query changes', () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate resizing to mobile viewport
    window.innerWidth = 600;
    act(() => {
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe(true);
  });

  it('should remove event listener on unmount', () => {
    window.innerWidth = 800;
    const { unmount } = renderHook(() => useIsMobile());

    expect(listeners.length).toBe(1);

    unmount();
    expect(listeners.length).toBe(0);
  });

  it('should return false during server-side rendering (getServerSnapshot)', async () => {
    const { renderToString } = await import('react-dom/server');
    const React = await import('react');

    function TestComponent() {
      const isMobile = useIsMobile();
      return React.createElement('span', null, isMobile ? 'mobile' : 'desktop');
    }

    const html = renderToString(React.createElement(TestComponent));
    expect(html).toContain('desktop');
  });
});
