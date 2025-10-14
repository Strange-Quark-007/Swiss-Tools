import debounce from 'lodash/debounce';
import { useEffect } from 'react';

import { GA_EVENTS } from '@/constants/gaEvents';

import { useTrackEvent } from './use-ga-events';

interface Options {
  auto?: boolean;
  delay?: number;
}

/**
 * A React hook that runs a callback with optional debouncing and auto-triggering.
 * Sends Google Analytics event when the callback is triggered.
 *
 * @param options - Configuration options for the hook.
 * @param callback - The function to execute when the dependencies change.
 *                   Wrap the callback in `useEffectEvent` for stable references.
 * @param deps - Dependency array. The effect will run whenever any of these values change.
 */
export function useDebouncedEffect(options: Options = {}, callback: () => void, deps: readonly unknown[]) {
  const { auto = true, delay = 300 } = options;
  const trackEvent = useTrackEvent();

  useEffect(() => {
    if (!auto) {
      return;
    }

    const debounced = debounce(() => {
      callback();
      trackEvent(GA_EVENTS.CONVERT_AUTO);
    }, delay);

    debounced();

    return () => debounced.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, delay, ...deps]);
}
