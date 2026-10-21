import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { usePreferencesStore } from '@/store/preferences-store';

import { useUnmountEffect } from '../use-unmount-effect';

describe('useUnmountEffect', () => {
  beforeEach(() => {
    usePreferencesStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.STRICT });
  });

  it('should not call the callback on mount or update', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(() => useUnmountEffect(callback));

    expect(callback).not.toHaveBeenCalled();

    rerender();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the callback when unmounted in STRICT dataRetentionMode', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useUnmountEffect(callback));

    expect(callback).not.toHaveBeenCalled();

    unmount();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback when unmounted in SESSION dataRetentionMode', () => {
    usePreferencesStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.SESSION });
    const callback = vi.fn();
    const { unmount } = renderHook(() => useUnmountEffect(callback));

    unmount();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the latest callback if callback changes before unmount', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender, unmount } = renderHook(({ cb }) => useUnmountEffect(cb), {
      initialProps: { cb: callback1 },
    });

    rerender({ cb: callback2 });
    expect(callback1).not.toHaveBeenCalled();

    unmount();
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should evaluate the latest dataRetentionMode at unmount when changed dynamically while mounted', () => {
    const callback = vi.fn();
    const { rerender, unmount } = renderHook(() => useUnmountEffect(callback));

    // Started in STRICT, switch to SESSION while mounted
    usePreferencesStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.SESSION });
    rerender();

    unmount();
    expect(callback).not.toHaveBeenCalled();
  });
});
