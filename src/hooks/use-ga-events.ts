'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useEffectEvent } from 'react';

import { GA_EVENTS } from '@/constants/gaEvents';

export const useTrackPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent(GA_EVENTS.PAGE_VIEW);
  }, [pathname, params, trackEvent]);
};

export const useTrackEvent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const trackEvent = useEffectEvent((eventName: GA_EVENTS, eventParams?: Record<string, unknown>) => {
    sendGAEvent('event', eventName, {
      page_path: pathname,
      ...params,
      ...eventParams,
    });
  });

  return trackEvent;
};
