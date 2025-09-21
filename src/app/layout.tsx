import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from 'next/font/google';

import { AppCommandProvider } from '@/components/providers/app-command-provider';
import { RegisterStores } from '@/components/providers/register-stores';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AppSidebar } from '@/components/app-layout/app-sidebar';
import { AppNavbar } from '@/components/app-layout/app-navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { getPageTitle } from '@/lib/utils';
import { getT } from '@/i18n/utils';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('app.meta.title'),
    description: t('app.meta.description'),
  };
}

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();
  const t = await getT();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname');

  const title = getPageTitle(pathname ?? '', t);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider>
              <AppCommandProvider>
                <AppSidebar />
                <RegisterStores />
                <Toaster richColors position="top-center" swipeDirections={['top']} closeButton />
                <main className="flex flex-col w-full h-screen">
                  <AppNavbar title={title} />
                  {children}
                </main>
              </AppCommandProvider>
            </SidebarProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
