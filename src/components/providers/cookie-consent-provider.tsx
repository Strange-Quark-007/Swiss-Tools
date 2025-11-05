'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

import { ROUTES } from '@/constants/routes';
import { useT } from '@/i18n/utils';

import CookieConsent from '../ui/cookie-consent';

export const CookieConsentProvider = () => {
  const { t, richT } = useT();
  const pathname = usePathname();

  const gtag = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
  const hideCookieConsent = pathname === ROUTES.PRIVACY;

  const applySavedConsent = () => {
    const match = document.cookie.match(/cookieConsent=(\w+)/);
    const consent = match ? match[1] : null;

    if (!consent) {
      return;
    }

    const update =
      consent === 'full'
        ? {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            analytics_storage: 'granted',
          }
        : consent === 'analytics'
        ? { analytics_storage: 'granted' }
        : {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
          };

    window.gtag?.('consent', 'update', update);
  };

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`}
        strategy="afterInteractive"
        onLoad={applySavedConsent}
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
            gtag('config', '${gtag}', {
              cookie_domain: 'auto',
              page_path: window.location.pathname
            });
          `,
        }}
      />

      {!hideCookieConsent && (
        <CookieConsent
          title={t('cookieConsent.title')}
          description={richT('cookieConsent.description')}
          descriptionClassName="space-y-2"
          secondaryLabel={t('cookieConsent.acceptAll')}
          primaryLabel={t('cookieConsent.acceptNecessary')}
          learnMoreLabel={t('cookieConsent.learnMore')}
          learnMoreHref={ROUTES.PRIVACY}
          onPrimaryCallback={() => {
            globalThis.gtag?.('consent', 'update', {
              analytics_storage: 'granted',
            });
          }}
          onSecondaryCallback={() => {
            globalThis.gtag?.('consent', 'update', {
              analytics_storage: 'granted',
              ad_user_data: 'granted',
              ad_storage: 'granted',
              ad_personalization: 'granted',
            });
          }}
        />
      )}
    </>
  );
};
