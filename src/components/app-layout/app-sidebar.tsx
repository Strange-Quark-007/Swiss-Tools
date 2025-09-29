'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Cog } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Heading } from '@/components/typography/heading';
import { CategoryList } from '@/components/sidebar/category-list';
import { appModules, staticModule } from '@/constants/appModules';
import { useFavorites } from '@/hooks/use-favorites';
import { useT } from '@/i18n/utils';
import { ROUTES } from '@/constants/routes';

export function AppSidebar() {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useSidebar();
  const appModulesList = appModules(t);
  const favorites = useFavorites(appModulesList);

  if (pathname === ROUTES.HOME) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center sticky top-0 z-10 w-full h-16 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <Cog className="[[data-state=expanded]_&]:hidden [[data-mobile=true]_&]:hidden" />
        <Heading
          onClick={() => router.push(ROUTES.HOME)}
          className={`flex text-nowrap transition-all duration-500 ease-in-out transform hover:cursor-pointer ${
            open ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        >
          {t('app.name')}
        </Heading>
      </SidebarHeader>
      <SidebarContent className="py-2 overflow-hidden">
        <CategoryList groups={[{ ...staticModule(t), label: '' }, favorites, ...appModulesList]} />
      </SidebarContent>
      <SidebarFooter className="flex justify-center w-full h-16 p-2">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
