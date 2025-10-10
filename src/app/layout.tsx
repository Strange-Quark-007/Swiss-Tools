import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import { AppNavbar } from '@/components/app-layout/app-navbar';
import { AppSidebar } from '@/components/app-layout/app-sidebar';
import { AppCommandProvider } from '@/components/providers/app-command-provider';
import { RegisterStores } from '@/components/providers/register-stores';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { getT } from '@/i18n/utils';
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

export async function generateMetadata() {
  const { t } = await getT();

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
  const { t } = await getT();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname');

  const title = getPageTitle(pathname ?? '', t);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider>
              <AppCommandProvider>
                <AppSidebar />
                <RegisterStores />
                <Toaster richColors position="top-center" swipeDirections={['top']} closeButton />
                <main className="flex flex-col w-full min-h-screen">
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
