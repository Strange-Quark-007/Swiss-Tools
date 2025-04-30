import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from 'next/font/google';

import { AppCommandProvider } from '@/components/providers/app-command-provider';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AppSidebar } from '@/components/app-layout/app-sidebar';
import { AppNavbar } from '@/components/app-layout/app-navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { StringUtils } from '@/lib/StringUtils';
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

  const isHome = !pathname || pathname === '' || pathname === '/';

  const path = !isHome && StringUtils.from(pathname!.split('/')[1]).parseFromKebab().toCamelCase().toString();
  const title = isHome ? t('dashboard.name') : t(`${path}.name`);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              <AppCommandProvider>
                <AppSidebar />
                <main className="flex-1">
                  <Toaster richColors />
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
