'use client';
import { Menu, Search, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { GA_EVENTS } from '@/constants/gaEvents';
import { ROUTES } from '@/constants/routes';
import { useT } from '@/i18n/utils';
import { getPageTitle } from '@/lib/utils';
import { useAppStore } from '@/store/store';

import { Button } from '../common/button';
import { useAppCommand } from '../providers/app-command-provider';
import { ToggleTheme } from '../theme/toggle-theme';
import { Heading } from '../typography/heading';
import { Text } from '../typography/text';
import { CommandShortcut } from '../ui/command';
import { useSidebar } from '../ui/sidebar';

interface Props {
  title: string;
}

export const AppNavbar = ({ title }: Props) => {
  const { t } = useT();
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

  const ariaHidden = pathname === ROUTES.HOME || pathname === ROUTES.DASHBOARD || pathname === ROUTES.PRIVACY;

  return (
    <>
      <header className="flex w-full h-16 sticky top-0 items-center px-4 py-2 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <NavigationMenu>
          <NavigationMenuList className="flex w-full justify-between">
            <NavigationMenuItem>
              <Heading
                aria-hidden={ariaHidden}
                className="text-nowrap font-extrabold text-2xl sm:text-4xl custom-transition-color"
              >
                {navbarTitle || title}
              </Heading>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex gap-2 md:gap-4 items-center">
              <Button
                eventName={GA_EVENTS.SEARCH}
                type="button"
                variant="outline"
                className="hidden sm:flex flexcommand-button-group gap-4 lg:gap-2 px-2 lg:w-40 border-1 hover:text-accent-foreground focus:outline-none custom-transition-color"
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
              {pathname !== ROUTES.HOME && (
                <Icon className="size-5 flex md:hidden" onClick={() => setOpenMobile(true)} />
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    </>
  );
};
