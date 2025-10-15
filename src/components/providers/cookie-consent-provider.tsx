'use client';

import Script from 'next/script';

import { useT } from '@/i18n/utils';

import CookieConsent from '../ui/cookie-consent';

export const CookieConsentProvider = () => {
  const { t, richT } = useT();

  const gtag = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

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
      <CookieConsent
        variant="small"
        title={t('cookieConsent.title')}
        description={richT('cookieConsent.description')}
        descriptionClassName="space-y-2"
        secondaryLabel={t('cookieConsent.acceptAll')}
        primaryLabel={t('cookieConsent.acceptNecessary')}
        onPrimaryCallback={() => {
          globalThis.gtag?.('consent', 'update', {
            analytics_storage: 'granted',
          });
        }}
        onSecondaryCallback={() => {
          globalThis.gtag?.('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
          });
        }}
      />
    </>
  );
};
