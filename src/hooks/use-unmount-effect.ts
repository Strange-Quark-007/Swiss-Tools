import { useEffect } from 'react';

/**
 * Runs a callback when the component unmounts.
 *
 * @param callback - The function to execute on unmount
 * @see Ref: ADR-002 (Explicit Per-Component Ephemeral Reset via useUnmountEffect)
 */
export const useUnmountEffect = (callback: () => void) => {
  useEffect(() => {
    return () => {
      callback();
    };
  }, [callback]);
};
