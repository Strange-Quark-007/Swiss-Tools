import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { GA_EVENTS } from '@/constants/gaEvents';

import { useDebouncedEffect } from '../use-debounced-effect';
import { useTrackEvent } from '../use-ga-events';

vi.mock('../use-ga-events', () => ({
  useTrackEvent: vi.fn(),
}));

describe('useDebouncedEffect', () => {
  const mockTrackEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(useTrackEvent).mockReturnValue(mockTrackEvent);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute callback and track GA event after default delay (300ms) when auto is true', () => {
    const callback = vi.fn();

    renderHook(() => useDebouncedEffect({}, callback, []));

    expect(callback).not.toHaveBeenCalled();
    expect(mockTrackEvent).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.CONVERT_AUTO);
  });

  it('should not execute callback or track event when auto is false', () => {
    const callback = vi.fn();

    renderHook(() => useDebouncedEffect({ auto: false }, callback, []));

    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it('should respect custom delay option', () => {
    const callback = vi.fn();

    renderHook(() => useDebouncedEffect({ auto: true, delay: 500 }, callback, []));

    vi.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel pending execution when dependencies change before delay completes', () => {
    const callback = vi.fn();

    const { rerender } = renderHook(({ dep }) => useDebouncedEffect({ delay: 300 }, callback, [dep]), {
      initialProps: { dep: 1 },
    });

    vi.advanceTimersByTime(200);
    expect(callback).not.toHaveBeenCalled();

    // Change dependency before timer fires
    rerender({ dep: 2 });

    vi.advanceTimersByTime(200);
    // Total 400ms passed from start, but reset means only 200ms into the second run
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel pending execution on unmount', () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => useDebouncedEffect({ delay: 300 }, callback, []));

    vi.advanceTimersByTime(150);
    unmount();

    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });
});
