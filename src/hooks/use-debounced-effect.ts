import { useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

interface Options {
  auto?: boolean;
  delay?: number;
}

/**
 * A React hook that runs a callback with optional debouncing and auto-triggering.
 *
 * @param options - Configuration options for the hook.
 * @param callback - The function to execute when the dependencies change.
 *                   Always the latest version of the callback is used internally.
 * @param deps - Dependency array. The effect will run whenever any of these values change.
 */
export function useDebouncedEffect(options: Options = {}, callback: () => void, deps: readonly unknown[]) {
  const { auto = true, delay = 300 } = options;
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    if (!auto) {
      return;
    }

    const debounced = debounce(() => callbackRef.current(), delay);
    debounced();

    return () => debounced.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, delay, ...deps]);
}
