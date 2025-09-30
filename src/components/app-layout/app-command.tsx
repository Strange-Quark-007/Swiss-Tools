'use client';

import { useEffect } from 'react';

import { useT } from '@/i18n/utils';
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
import { Text } from '@/components/typography/text';
import { appModules, staticModule } from '@/constants/appModules';
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { useFavorites } from '@/hooks/use-favorites';
import { ROUTES } from '@/constants/routes';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function AppCommand({ open, setOpen }: Props) {
  const { t } = useT();
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
        setOpen(true);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md md:min-w-[450px] pb-2">
        <CommandInput placeholder={t('command.placeholder')} />
        <CommandList>
          <CommandEmpty>{t('command.empty')}</CommandEmpty>
          {groups.map((group, groupIndex) => {
            if (!group.items.length) {
              return null;
            }
            return (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map(({ id, name, icon: Icon, shortcut }) => (
                  <CommandItem key={name} onSelect={() => handleSelect(id)} className="cursor-pointer">
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
