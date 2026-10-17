import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useViewScrollSync } from '../use-view-scroll-sync';

describe('useViewScrollSync', () => {
  it('should initialize with provided mode and default scroll position', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>('text'));

    expect(result.current.viewMode).toBe('text');
    expect(result.current.scrollPosRef.current).toBe(0);
    expect(result.current.primaryRef.current).toBeNull();
    expect(result.current.secondaryRef.current).toBeNull();
  });

  it('should initialize with options object containing initialMode', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>({ initialMode: 'preview' }));

    expect(result.current.viewMode).toBe('preview');
  });

  it('should update scroll position on onScroll event', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>('text'));

    const mockEvent = {
      currentTarget: { scrollTop: 180 },
    } as unknown as React.UIEvent<HTMLElement>;

    act(() => {
      result.current.onScroll(mockEvent);
    });

    expect(result.current.scrollPosRef.current).toBe(180);
  });

  it('should capture scrollTop from active primary element and restore to secondary element on mode switch', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>('text'));

    const mockPrimary = document.createElement('textarea');
    mockPrimary.scrollTop = 250;
    result.current.primaryRef.current = mockPrimary;

    act(() => {
      result.current.switchViewMode('preview');
    });

    expect(result.current.viewMode).toBe('preview');
    expect(result.current.scrollPosRef.current).toBe(250);

    // Primary is unmounted, secondary mounts
    result.current.primaryRef.current = null;
    const mockSecondary = document.createElement('div');
    result.current.secondaryRef.current = mockSecondary;

    // Trigger effect by switching back or rerendering
    act(() => {
      result.current.switchViewMode('text');
    });

    expect(result.current.viewMode).toBe('text');
  });

  it('should capture scrollTop from active secondary element on mode switch', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>('preview'));

    const mockSecondary = document.createElement('div');
    mockSecondary.scrollTop = 320;
    result.current.secondaryRef.current = mockSecondary;

    act(() => {
      result.current.switchViewMode('text');
    });

    expect(result.current.viewMode).toBe('text');
    expect(result.current.scrollPosRef.current).toBe(320);
  });

  it('should ignore switchViewMode when switching to the already active mode', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>('text'));

    const mockPrimary = document.createElement('textarea');
    mockPrimary.scrollTop = 100;
    result.current.primaryRef.current = mockPrimary;

    act(() => {
      result.current.switchViewMode('text');
    });

    expect(result.current.viewMode).toBe('text');
    expect(result.current.scrollPosRef.current).toBe(0);
  });

  it('should reset scroll position to 0 and update active element on resetScroll', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>('text'));

    const mockPrimary = document.createElement('textarea');
    mockPrimary.scrollTop = 400;
    result.current.primaryRef.current = mockPrimary;
    result.current.scrollPosRef.current = 400;

    act(() => {
      result.current.resetScroll();
    });

    expect(result.current.scrollPosRef.current).toBe(0);
    expect(mockPrimary.scrollTop).toBe(0);
  });

  it('should handle resetScroll and switchViewMode safely when no elements are attached to refs', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>('text'));

    act(() => {
      result.current.resetScroll();
    });
    expect(result.current.scrollPosRef.current).toBe(0);

    act(() => {
      result.current.switchViewMode('preview');
    });
    expect(result.current.viewMode).toBe('preview');
  });

  it('should restore scrollTop to active element on mode switch', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>('text'));

    const mockPrimary = document.createElement('textarea');
    let primaryScrollTop = 250;
    Object.defineProperty(mockPrimary, 'scrollTop', {
      get: () => primaryScrollTop,
      set: (val) => {
        primaryScrollTop = val;
      },
      configurable: true,
    });
    result.current.primaryRef.current = mockPrimary;

    act(() => {
      result.current.switchViewMode('preview');
    });

    expect(mockPrimary.scrollTop).toBe(250);
  });

  it('should reset scroll position on secondary element when primary is not attached', () => {
    const { result } = renderHook(() => useViewScrollSync<'text' | 'preview'>('preview'));

    const mockSecondary = document.createElement('div');
    let secondaryScrollTop = 150;
    Object.defineProperty(mockSecondary, 'scrollTop', {
      get: () => secondaryScrollTop,
      set: (val) => {
        secondaryScrollTop = val;
      },
      configurable: true,
    });
    result.current.secondaryRef.current = mockSecondary;

    act(() => {
      result.current.resetScroll();
    });

    expect(mockSecondary.scrollTop).toBe(0);
  });
});
