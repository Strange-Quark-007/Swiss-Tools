import { Analytics } from '@vercel/analytics/next';
import { cn } from 'cn';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import { AppNavbar } from '@/components/app-layout/app-navbar';
import { AppSidebar } from '@/components/app-layout/app-sidebar';
import { AppCommandProvider } from '@/components/providers/app-command-provider';
import { CookieConsentProvider } from '@/components/providers/cookie-consent-provider';
import { GAPageViewTracker } from '@/components/providers/ga-page-view-tracker';
import { RegisterStores } from '@/components/providers/register-stores';
import { ViewTransitionProvider } from '@/components/providers/view-transition-provider';
import { JsonLd } from '@/components/seo/json-ld';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { APP_NAME, CREATOR_NAME, customScrollbarCss } from '@/constants/common';
import { DEFAULT_APP_KEYWORDS } from '@/constants/seo';
import { getT } from '@/i18n/utils';
import { generateWebsiteJsonLd } from '@/lib/json-ld';
import { getPageTitle } from '@/lib/utils';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();

  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const title = t('app.meta.title');
  const description = t('app.meta.description');

  const metadataBase = origin && URL.canParse(origin) ? new URL(origin) : undefined;

  return {
    ...(metadataBase && { metadataBase }),
    title: {
      default: title,
      template: '%s',
    },
    description,
    applicationName: APP_NAME,
    keywords: [...DEFAULT_APP_KEYWORDS],
    authors: [{ name: CREATOR_NAME }],
    creator: CREATOR_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: origin,
    },
    openGraph: {
      title,
      description,
      url: origin,
      siteName: APP_NAME,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `${origin}/web-app-manifest-512x512.png`,
          width: 512,
          height: 512,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${origin}/web-app-manifest-512x512.png`],
    },
  };
}

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();
  const { t } = await getT();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname');

  const title = getPageTitle(pathname ?? '', t);

  return (
    <html lang={locale} className={customScrollbarCss} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Swiss Tools" />
        <JsonLd data={generateWebsiteJsonLd()} />
      </head>
      <body className={cn('antialiased', geistSans.variable, geistMono.variable)}>
        <Analytics />
        <ViewTransitionProvider>
          <NextIntlClientProvider locale={locale}>
            <CookieConsentProvider />
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SidebarProvider>
                <AppCommandProvider>
                  <AppSidebar />
                  <RegisterStores />
                  <GAPageViewTracker />
                  <Toaster richColors position="top-center" swipeDirections={['top']} />
                  <main className="flex flex-col w-full min-h-screen">
                    <AppNavbar title={title} />
                    {children}
                  </main>
                </AppCommandProvider>
              </SidebarProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </ViewTransitionProvider>
      </body>
    </html>
  );
}
