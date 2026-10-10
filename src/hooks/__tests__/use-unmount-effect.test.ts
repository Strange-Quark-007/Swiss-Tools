import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useUnmountEffect } from '../use-unmount-effect';

describe('useUnmountEffect', () => {
  it('should not call the callback on mount or update', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(() => useUnmountEffect(callback));

    expect(callback).not.toHaveBeenCalled();

    rerender();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the callback when unmounted', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useUnmountEffect(callback));

    expect(callback).not.toHaveBeenCalled();

    unmount();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call the latest callback if callback changes before unmount', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender, unmount } = renderHook(({ cb }) => useUnmountEffect(cb), {
      initialProps: { cb: callback1 },
    });

    rerender({ cb: callback2 });
    unmount();

    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
