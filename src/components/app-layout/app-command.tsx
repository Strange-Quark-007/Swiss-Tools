'use client';

import { useEffect } from 'react';

import { Text } from '@/components/typography/text';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { appModules, staticModule } from '@/constants/appModules';
import { customScrollbarCss } from '@/constants/common';
import { GA_EVENTS } from '@/constants/gaEvents';
import { ROUTES } from '@/constants/routes';
import { useFavorites } from '@/hooks/use-favorites';
import { useTrackEvent } from '@/hooks/use-ga-events';
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { useT } from '@/i18n/utils';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function AppCommand({ open, setOpen }: Props) {
  const { t } = useT();
  const trackEvent = useTrackEvent();
  const navigate = useModuleNavigation();
  const appModulesList = appModules(t);
  const favorites = useFavorites(appModulesList);

  const groups = [staticModule(t), favorites, ...appModulesList];

  const handleSelect = (id: ROUTES) => {
    setOpen(false);
    navigate(id);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        trackEvent(GA_EVENTS.COMMAND);
        setOpen(true);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [setOpen, trackEvent]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md md:min-w-[450px] pb-2">
        <CommandInput placeholder={t('command.placeholder')} />
        <CommandList className={customScrollbarCss}>
          <CommandEmpty>{t('command.empty')}</CommandEmpty>
          {groups.map((group, groupIndex) => {
            if (!group.items.length) {
              return null;
            }
            return (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map(({ id, name, icon: Icon, shortcut }) => (
                  <CommandItem
                    key={name}
                    value={`${group.label}-${name}`}
                    onSelect={() => handleSelect(id)}
                    className="cursor-pointer"
                  >
                    <Icon />
                    <Text variant="small">{name}</Text>
                    {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
                  </CommandItem>
                ))}
                {groupIndex < groups.length - 1 && <CommandSeparator className="my-2" />}
              </CommandGroup>
            );
          })}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
