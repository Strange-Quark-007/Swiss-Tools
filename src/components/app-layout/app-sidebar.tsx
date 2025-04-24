'use client';

import { FileText, HelpCircle, Home, Settings, Users } from 'lucide-react';

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
import { Category } from '@/types/sidebar';
import { useT } from '@/i18n/utils';

const staticModules: Category[] = [
  {
    label: '',
    items: [{ icon: Home, name: 'Home', tooltip: 'Go to home page' }],
  },
];

const sidebarModules: Category[] = [
  {
    label: 'Main',
    items: [
      { icon: FileText, name: 'Documents', tooltip: 'View Documents' },
      { icon: Users, name: 'Users', tooltip: 'Manage Users' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { icon: Settings, name: 'Preferences', tooltip: 'Change Preferences' },
      { icon: HelpCircle, name: 'Help', tooltip: 'Get Help' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { icon: Settings, name: 'Preferences', tooltip: 'Change Preferences' },
      { icon: HelpCircle, name: 'Help', tooltip: 'Get Help' },
    ],
  },
];

export function AppSidebar() {
  const t = useT();
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center sticky top-0 z-10 w-full h-16 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <Settings className="text-xl [[data-side=left][data-state=expanded]_&]:hidden" />
        <Heading
          level={1}
          className={`flex lg:text-[2.625rem] text-nowrap transition-all duration-500 ease-in-out transform ${
            open ? 'opacity-100' : 'opacity-0 hidden'
          }`}
        >
          {t('app.name')}
        </Heading>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <CategoryList categories={[...staticModules, ...sidebarModules]} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
