'use client';

import { redirect } from 'next/navigation';
import { Home, Settings } from 'lucide-react';

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
import { AppModuleGroup } from '@/types/app-module';
import { useT } from '@/i18n/utils';
import { appModules } from '@/constants/appModules';

const staticModules: AppModuleGroup[] = [
  {
    label: '',
    items: [{ id: '/', name: 'Home', icon: Home, tooltip: 'Dashboard', onSelect: () => redirect('/') }],
  },
];

export function AppSidebar() {
  const t = useT();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center sticky top-0 z-10 w-full h-16 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <Settings className="text-xl [[data-state=expanded]_&]:hidden [[data-mobile=true]_&]:hidden" />
        <Heading
          level={1}
          className={`flex lg:text-[2.5rem] text-nowrap transition-all duration-500 ease-in-out transform ${
            open ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        >
          {t('app.name')}
        </Heading>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <CategoryList groups={[...staticModules, ...appModules(t)]} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
