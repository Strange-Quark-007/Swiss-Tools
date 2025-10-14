'use client';

import { useTrackPageView } from '@/hooks/use-ga-events';

export const GAPageViewTracker = () => {
  useTrackPageView();
  return null;
};
