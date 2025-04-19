'use client';

import { useTranslations } from 'next-intl';

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { ToggleTheme } from '../theme/toggle-theme';
import { Input } from '../ui/input';

export const AppNavbar = () => {
  const t = useTranslations();
  return (
    <header className="h-16 sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <NavigationMenu className="flex justify-end w-full p-4">
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
