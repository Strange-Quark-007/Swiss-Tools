'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { useAppStore } from '@/store/store';
import { getPageTitle } from '@/lib/utils';
import { useT } from '@/i18n/utils';

import { useAppCommand } from '../providers/app-command-provider';
import { ToggleTheme } from '../theme/toggle-theme';
import { Heading } from '../typography/heading';
import { Button } from '../ui/button';
import { Text } from '../typography/text';
import { CommandShortcut } from '../ui/command';
import { useSidebar } from '../ui/sidebar';

interface Props {
  title: string;
}

export const AppNavbar = ({ title }: Props) => {
  const t = useT();
  const pathname = usePathname();
  const { openMobile, setOpenMobile } = useSidebar();
  const { setOpen } = useAppCommand();
  const { navbarTitle, setNavbarTitle } = useAppStore();

  const Icon = openMobile ? X : Menu;

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  useEffect(() => {
    const resolvedTitle = getPageTitle(pathname, t);
    setNavbarTitle(resolvedTitle);
  }, [pathname, navbarTitle, setNavbarTitle, t]);

  return (
    <>
      <header className="flex w-full h-16 sticky top-0 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary items-center px-4 py-2">
        <NavigationMenu>
          <NavigationMenuList className="flex w-full justify-between">
            <NavigationMenuItem>
              <Heading className="text-nowrap transition-all duration-500 ease-in-out font-extrabold">
                {navbarTitle || title}
              </Heading>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex gap-2 md:gap-4 items-center">
              <Button
                type="button"
                variant="outline"
                className="hidden sm:flex flexcommand-button-group gap-4 lg:gap-2 px-2 lg:w-40 border-1 hover:text-accent-foreground hover:bg-accent focus:outline-none transition-colors duration-300 ease-in-out"
                onClick={() => setOpen(true)}
              >
                <Text className="[.command-button-group:hover_&]:text-accent-foreground" muted>
                  <Search />
                </Text>
                <Text className="[.command-button-group:hover_&]:text-accent-foreground hidden lg:flex" muted>
                  {t('command.placeholder')}
                </Text>
                <CommandShortcut className="bg-muted text-xs p-1 rounded-sm [.command-button-group:hover_&]:text-accent-foreground">
                  {t('command.shortcut')}
                </CommandShortcut>
              </Button>
              <ToggleTheme />
              <Icon className="size-5 flex sm:hidden" onClick={() => setOpenMobile(true)} />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    </>
  );
};
