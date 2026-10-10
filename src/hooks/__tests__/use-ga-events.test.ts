import { renderHook } from '@testing-library/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

import { GA_EVENTS } from '@/constants/gaEvents';

import { useTrackEvent, useTrackPageView } from '../use-ga-events';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('use-ga-events', () => {
  const mockUsePathname = usePathname as Mock;
  const mockUseSearchParams = useSearchParams as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/case-converter');
    mockUseSearchParams.mockReturnValue(new URLSearchParams('from=lowercase&to=uppercase'));
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).gtag;
  });

  describe('useTrackEvent', () => {
    it('should invoke window.gtag with event name, pathname, search params, and custom event params', () => {
      const mockGtag = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag = mockGtag;

      const { result } = renderHook(() => useTrackEvent());

      result.current(GA_EVENTS.CONVERT, { extra: 'param' });

      expect(mockGtag).toHaveBeenCalledWith('event', GA_EVENTS.CONVERT, {
        page_path: '/case-converter',
        from: 'lowercase',
        to: 'uppercase',
        extra: 'param',
      });
    });

    it('should not throw or invoke anything if window.gtag is not defined', () => {
      const { result } = renderHook(() => useTrackEvent());

      expect(() => {
        result.current(GA_EVENTS.CONVERT_AUTO);
      }).not.toThrow();
    });
  });

  describe('useTrackPageView', () => {
    it('should automatically track page view on mount', () => {
      const mockGtag = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag = mockGtag;

      renderHook(() => useTrackPageView());

      expect(mockGtag).toHaveBeenCalledWith('event', GA_EVENTS.PAGE_VIEW, {
        page_path: '/case-converter',
        from: 'lowercase',
        to: 'uppercase',
      });
    });

    it('should re-track page view when pathname changes', () => {
      const mockGtag = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag = mockGtag;

      const { rerender } = renderHook(() => useTrackPageView());
      expect(mockGtag).toHaveBeenCalledTimes(1);

      mockUsePathname.mockReturnValue('/number-converter');
      rerender();

      expect(mockGtag).toHaveBeenCalledTimes(2);
      expect(mockGtag).toHaveBeenLastCalledWith('event', GA_EVENTS.PAGE_VIEW, {
        page_path: '/number-converter',
        from: 'lowercase',
        to: 'uppercase',
      });
    });
  });
});
