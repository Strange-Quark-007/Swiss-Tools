'use client';

import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';

import SwissTools from '@/assets/icons/SwissTools';
import { CategoryList } from '@/components/sidebar/category-list';
import { Heading } from '@/components/typography/heading';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { appModules, staticModule } from '@/constants/appModules';
import { customScrollbarCss } from '@/constants/common';
import { GA_EVENTS } from '@/constants/gaEvents';
import { ROUTES } from '@/constants/routes';
import { useFavorites } from '@/hooks/use-favorites';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';
import { AppModuleGroup } from '@/types/app-module';

export function AppSidebar() {
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useSidebar();
  const appModulesList = appModules(t);
  const favorites = useFavorites(appModulesList);

  const [favs, setFavs] = useState<AppModuleGroup[]>([]);

  useEffect(() => {
    startTransition(() => {
      setFavs([favorites]);
    });
  }, [favorites]);

  const ariaHidden = pathname === ROUTES.DASHBOARD;

  if (pathname === ROUTES.HOME || pathname === ROUTES.PRIVACY) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center sticky top-0 z-10 w-full h-16 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <SwissTools
          className="size-8 [[data-state=expanded]_&]:hidden [[data-mobile=true]_&]:hidden hover:cursor-pointer"
          onClick={() => router.push(ROUTES.HOME)}
        />
        <Heading
          aria-hidden={ariaHidden}
          onClick={() => router.push(ROUTES.HOME)}
          className={`flex text-nowrap transition-all duration-500 ease-in-out transform hover:cursor-pointer ${
            open ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        >
          {t('app.name')}
        </Heading>
      </SidebarHeader>
      <SidebarContent className={cn('py-2 overflow-x-hidden', customScrollbarCss)}>
        <CategoryList groups={[{ ...staticModule(t), label: '' }]} />
        <CategoryList groups={favs} />
        <CategoryList groups={appModulesList} />
      </SidebarContent>
      <SidebarFooter className="flex justify-center w-full h-16 p-2">
        <SidebarTrigger eventName={GA_EVENTS.SIDEBAR_TOGGLE} />
      </SidebarFooter>
    </Sidebar>
  );
}
