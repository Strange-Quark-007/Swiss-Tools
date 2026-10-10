import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

import { ROUTES } from '@/constants/routes';

import { CookieConsentProvider } from '../cookie-consent-provider';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/i18n/utils', () => ({
  useT: () => ({
    t: (key: string) => key,
    richT: (key: string) => key,
  }),
}));

vi.mock('next/script', () => ({
  default: ({
    onLoad,
    src,
    id,
    dangerouslySetInnerHTML,
  }: {
    onLoad?: () => void;
    src?: string;
    id?: string;
    dangerouslySetInnerHTML?: { __html: string };
  }) => (
    <div
      data-testid={id ? `script-${id}` : 'script-tag'}
      data-src={src}
      onClick={onLoad}
      data-html={dangerouslySetInnerHTML?.__html}
    />
  ),
}));

vi.mock('../../ui/cookie-consent', () => ({
  default: ({
    onPrimaryCallback,
    onSecondaryCallback,
  }: {
    onPrimaryCallback?: () => void;
    onSecondaryCallback?: () => void;
  }) => (
    <div data-testid="mock-cookie-consent">
      <button data-testid="consent-primary-btn" onClick={onPrimaryCallback}>
        Accept Necessary
      </button>
      <button data-testid="consent-secondary-btn" onClick={onSecondaryCallback}>
        Accept All
      </button>
    </div>
  ),
}));

describe('CookieConsentProvider', () => {
  const mockGtag = vi.fn();
  const mockUsePathname = usePathname as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/some-route');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag = mockGtag;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).gtag = mockGtag;
    document.cookie = '';
  });

  afterEach(() => {
    cleanup();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).gtag;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).gtag;
  });

  it('should render scripts and CookieConsent widget on standard routes', () => {
    render(<CookieConsentProvider />);

    expect(screen.getByTestId('script-tag')).toBeDefined();
    expect(screen.getByTestId('script-google-analytics')).toBeDefined();
    expect(screen.getByTestId('mock-cookie-consent')).toBeDefined();
  });

  it('should hide CookieConsent widget when current route is privacy page', () => {
    mockUsePathname.mockReturnValue(ROUTES.PRIVACY);

    render(<CookieConsentProvider />);

    expect(screen.queryByTestId('mock-cookie-consent')).toBeNull();
  });

  it('should update gtag consent on primary callback (analytics only)', () => {
    render(<CookieConsentProvider />);

    fireEvent.click(screen.getByTestId('consent-primary-btn'));

    expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted',
    });
  });

  it('should update gtag consent on secondary callback (all granted)', () => {
    render(<CookieConsentProvider />);

    fireEvent.click(screen.getByTestId('consent-secondary-btn'));

    expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_storage: 'granted',
      ad_personalization: 'granted',
    });
  });

  describe('applySavedConsent via script onLoad', () => {
    it('should do nothing if cookieConsent is not set in document.cookie', () => {
      document.cookie = 'otherCookie=value';
      render(<CookieConsentProvider />);

      fireEvent.click(screen.getByTestId('script-tag'));

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should grant all permissions when cookieConsent=full', () => {
      document.cookie = 'cookieConsent=full';
      render(<CookieConsentProvider />);

      fireEvent.click(screen.getByTestId('script-tag'));

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });
    });

    it('should grant analytics permission when cookieConsent=analytics', () => {
      document.cookie = 'cookieConsent=analytics';
      render(<CookieConsentProvider />);

      fireEvent.click(screen.getByTestId('script-tag'));

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
      });
    });

    it('should deny all permissions when cookieConsent is set to necessary/other', () => {
      document.cookie = 'cookieConsent=necessary';
      render(<CookieConsentProvider />);

      fireEvent.click(screen.getByTestId('script-tag'));

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
    });
  });
});
