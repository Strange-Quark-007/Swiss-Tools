import { useEffect, useRef } from 'react';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { useAppStore } from '@/store/app-store';

/**
 * Runs a callback when the component unmounts if data retention mode is STRICT.
 * When data retention mode is SESSION, resets are bypassed to keep in-memory state.
 *
 * @param callback - The function to execute on unmount
 * @see Ref: ADR-002 (Explicit Per-Component Ephemeral Reset via useUnmountEffect)
 * @see Ref: ADR-009 (Configurable Data Retention Modes: Strict Privacy vs. Session Memory)
 */
export const useUnmountEffect = (callback: () => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (useAppStore.getState().dataRetentionMode === DATA_RETENTION_MODE.STRICT) {
        callbackRef.current();
      }
    };
  }, []);
};
