import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import { testRichT, testT } from './i18n';

afterEach(() => {
  cleanup();
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    vi.mocked(navigator.clipboard.writeText).mockClear();
  }
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

vi.mock('@/hooks/use-download-file', () => ({
  useDownloadFile: vi.fn(() => vi.fn()),
}));

vi.mock('@/hooks/use-file-upload', () => ({
  useFileUpload: vi.fn(() => ({
    fileInputRef: { current: null },
    handleFileChange: vi.fn(),
    openFileDialog: vi.fn(),
  })),
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

if (typeof navigator !== 'undefined') {
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(''),
      },
      writable: true,
      configurable: true,
    });
  } else {
    if (!navigator.clipboard.writeText) {
      navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);
    }
    if (!navigator.clipboard.readText) {
      navigator.clipboard.readText = vi.fn().mockResolvedValue('');
    }
  }
}
