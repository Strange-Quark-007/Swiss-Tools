'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { GA_EVENTS } from '@/constants/ga-events';

export const useTrackPageView = () => {
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent(GA_EVENTS.PAGE_VIEW);
  }, [trackEvent]);
};

export const useTrackEvent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Serialize the query so the callback identity only changes when the parameters
  // actually change, instead of on every render (the params object is unstable).
  const searchParamsString = searchParams.toString();

  const trackEvent = useCallback(
    (eventName: GA_EVENTS, eventParams?: Record<string, unknown>) => {
      if (typeof window !== 'undefined' && window.gtag) {
        gtag?.('event', eventName, {
          page_path: pathname,
          ...Object.fromEntries(new URLSearchParams(searchParamsString).entries()),
          ...eventParams,
        });
      }
    },
    [pathname, searchParamsString]
  );

  return trackEvent;
};
