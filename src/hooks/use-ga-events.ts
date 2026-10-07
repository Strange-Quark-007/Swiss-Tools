'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { GA_EVENTS } from '@/constants/gaEvents';

export const useTrackPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const paramsString = JSON.stringify(params);
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent(GA_EVENTS.PAGE_VIEW);
  }, [pathname, paramsString, trackEvent]);
};

export const useTrackEvent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const trackEvent = useCallback(
    (eventName: GA_EVENTS, eventParams?: Record<string, unknown>) => {
      if (typeof window !== 'undefined' && window.gtag) {
        gtag?.('event', eventName, {
          page_path: pathname,
          ...params,
          ...eventParams,
        });
      }
    },
    [pathname, params]
  );

  return trackEvent;
};
