import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import { testRichT, testT } from './i18n';

afterEach(() => {
  cleanup();
});

vi.mock('@/i18n/utils', () => ({
  getT: async () => ({ t: testT, richT: testRichT }),
  useT: () => ({ t: testT, richT: testRichT }),
}));

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: vi.fn(() => vi.fn()),
  useTrackPageView: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    message: vi.fn(),
  },
  Toaster: vi.fn(() => null),
}));

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  if (!global.ResizeObserver) {
    global.ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };
  }

  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  }
}
