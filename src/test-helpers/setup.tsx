import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

import { resetAppStore } from './app-store';
import { testRichT, testT } from './i18n';

// ---------------------------------------------------------------------------
// Test Lifecycle
// ---------------------------------------------------------------------------

beforeEach(() => {
  // `persist` rehydrates at module load, so clearing storage prevents leakage
  // into the next case while `resetAppStore` restores the in-memory defaults.
  localStorage.clear();
  resetAppStore();
});

afterEach(() => {
  cleanup();
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    vi.mocked(navigator.clipboard.writeText).mockClear();
  }
});

// ---------------------------------------------------------------------------
// Browser / DOM Environment Polyfills
// ---------------------------------------------------------------------------

if (typeof window !== 'undefined') {
  // Mock window.matchMedia for theme and responsive tests
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

  // Stub scrollIntoView for command palette and dropdown navigation
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  }

  // Polyfill ResizeObserver for Radix UI / layout observers
  if (!global.ResizeObserver) {
    global.ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };
  }
}

// Mock Clipboard API for copy/paste actions across converters & tools
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

// ---------------------------------------------------------------------------
// Third-Party Library Mocks
// ---------------------------------------------------------------------------

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({
    back: vi.fn(),
    forward: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
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

// ---------------------------------------------------------------------------
// Application Shared Mocks
// ---------------------------------------------------------------------------

vi.mock('@/i18n/utils', () => ({
  getT: async () => ({ t: testT, richT: testRichT }),
  useT: () => ({ t: testT, richT: testRichT }),
}));

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: vi.fn(() => vi.fn()),
  useTrackPageView: vi.fn(),
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

// ---------------------------------------------------------------------------
// Component Mocks
// ---------------------------------------------------------------------------

// Mock async Server Component in client page tests.
// This avoids suspended component tree errors during client rendering.
vi.mock('@/components/app-layout/app-breadcrumb', () => ({
  AppBreadcrumb: ({ items }: { items: { label: string }[] }) => (
    <nav data-testid="app-breadcrumb">
      {items?.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  ),
}));
