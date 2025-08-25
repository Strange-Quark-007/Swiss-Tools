'use client';

import { useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';

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
import { AppModuleGroup } from '@/types/app-module';
import { appModules } from '@/constants/appModules';
import { Text } from '@/components/typography/text';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function AppCommand({ open, setOpen }: Props) {
  const t = useT();

  const staticGroup: AppModuleGroup[] = [
    {
      label: 'Dashboard',
      items: [
        {
          id: 'dashboard',
          name: 'Dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
  ];

  const groups = [...staticGroup, ...appModules(t)];

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
          {groups.map((group, groupIndex) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.map(({ name, icon: Icon, shortcut }) => (
                <CommandItem key={name}>
                  <Icon />
                  <Text variant="small">{name}</Text>
                  {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
              {groupIndex < groups.length - 1 && <CommandSeparator className="my-2" />}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
