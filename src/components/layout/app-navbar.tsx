'use client';

import { useTranslations } from 'next-intl';

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { ToggleTheme } from './toggle-theme';
import { Input } from '../ui/input';

export const AppNavbar = () => {
  const t = useTranslations();
  return (
    <header>
      <NavigationMenu className="flex w-full p-4">
        <NavigationMenuList className="gap-16">
          <NavigationMenuItem>
            <Input placeholder={t('command.placeholder')} />
          </NavigationMenuItem>
          <ToggleTheme />
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
