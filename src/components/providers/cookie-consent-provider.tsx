'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

import { ROUTES } from '@/constants/routes';
import { useT } from '@/i18n/utils';

import CookieConsent from '../ui/cookie-consent';

export const CookieConsentProvider = () => {
  const { t, richT } = useT();
  const pathname = usePathname();

  const gtag = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
  const hideCookieConsent = pathname === ROUTES.PRIVACY;

  useEffect(() => {
    const consentCookie = document.cookie.match(/cookieConsent=(\w+)/);
    const consent = consentCookie ? consentCookie[1] : null;

    const applyConsent = () => {
      if (consent === 'analytics') {
        window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
      } else if (consent === 'full') {
        window.gtag?.('consent', 'update', {
          analytics_storage: 'granted',
          ad_user_data: 'granted',
          ad_storage: 'granted',
          ad_personalization: 'granted',
        });
      }
    };

    if (window.gtag) {
      applyConsent();
    } else {
      const id = setInterval(() => {
        if (window.gtag) {
          applyConsent();
          clearInterval(id);
        }
      }, 200);
    }
  }, []);

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`} />

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
              page_path: window.location.pathname,
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
