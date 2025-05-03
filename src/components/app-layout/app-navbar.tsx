'use client';

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { useAppStore } from '@/store/store';
import { useT } from '@/i18n/utils';

import { useAppCommand } from '../providers/app-command-provider';
import { ToggleTheme } from '../theme/toggle-theme';
import { Heading } from '../typography/heading';
import { Button } from '../ui/button';
import { Text } from '../typography/text';
import { CommandShortcut } from '../ui/command';

interface Props {
  title: string;
}

export const AppNavbar = ({ title }: Props) => {
  const t = useT();
  const { setOpen } = useAppCommand();
  const navbarTitle = useAppStore((s) => s.navbarTitle);

  return (
    <>
      <header className="flex w-full h-16 sticky top-0 z-10 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary items-center px-6 py-2">
        <NavigationMenu>
          <NavigationMenuList className="flex w-full justify-between">
            <NavigationMenuItem>
              <Heading level={1} className="text-nowrap transition-all duration-500">
                {navbarTitle || title}
              </Heading>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="command-button-group gap-6 px-2 w-40 border-1 hover:cursor-pointer hover:text-accent-foreground hover:bg-accent focus:outline-none transition-colors duration-300 ease-in-out"
                onClick={() => setOpen(true)}
              >
                <Text className="[.command-button-group:hover_&]:text-accent-foreground" muted>
                  {t('command.placeholder')}
                </Text>
                <CommandShortcut className="bg-muted text-xs p-1 rounded-sm [.command-button-group:hover_&]:text-accent-foreground">
                  {t('command.shortcut')}
                </CommandShortcut>
              </Button>
              <ToggleTheme />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    </>
  );
};
