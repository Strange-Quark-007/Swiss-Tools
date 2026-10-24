import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

export interface UseViewScrollSyncOptions<TMode extends string = string> {
  initialMode: TMode;
}

export interface UseViewScrollSyncResult<
  TMode extends string = string,
  TPrimary extends HTMLElement = HTMLElement,
  TSecondary extends HTMLElement = HTMLElement,
> {
  viewMode: TMode;
  setViewMode: Dispatch<SetStateAction<TMode>>;
  switchViewMode: (mode: TMode) => void;
  primaryRef: RefObject<TPrimary | null>;
  secondaryRef: RefObject<TSecondary | null>;
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
  resetScroll: () => void;
  scrollPosRef: RefObject<number>;
}

/**
 * Hook to synchronize scroll positions across toggled view modes (e.g. editor vs preview/highlight).
 */
export function useViewScrollSync<
  TMode extends string = string,
  TPrimary extends HTMLElement = HTMLElement,
  TSecondary extends HTMLElement = HTMLElement,
>(options: UseViewScrollSyncOptions<TMode> | TMode): UseViewScrollSyncResult<TMode, TPrimary, TSecondary> {
  const initialMode = typeof options === 'string' ? options : options.initialMode;
  const [viewMode, setViewMode] = useState<TMode>(initialMode);
  const primaryRef = useRef<TPrimary | null>(null);
  const secondaryRef = useRef<TSecondary | null>(null);
  const scrollPosRef = useRef(0);

  const switchViewMode = useCallback(
    (mode: TMode) => {
      if (mode === viewMode) {
        return;
      }
      const activeEl = primaryRef.current ?? secondaryRef.current;
      if (activeEl) {
        scrollPosRef.current = activeEl.scrollTop;
      }
      setViewMode(mode);
    },
    [viewMode]
  );

  useEffect(() => {
    const activeEl = primaryRef.current ?? secondaryRef.current;
    if (activeEl) {
      activeEl.scrollTop = scrollPosRef.current;
    }
  }, [viewMode]);

  const onScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    scrollPosRef.current = e.currentTarget.scrollTop;
  }, []);

  const resetScroll = useCallback(() => {
    scrollPosRef.current = 0;
    const activeEl = primaryRef.current ?? secondaryRef.current;
    if (activeEl) {
      activeEl.scrollTop = 0;
    }
  }, []);

  return {
    viewMode,
    setViewMode,
    switchViewMode,
    primaryRef,
    secondaryRef,
    onScroll,
    resetScroll,
    scrollPosRef,
  };
}
