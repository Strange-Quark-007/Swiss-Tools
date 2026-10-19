'use client';

import { FlaskConical, Settings, Sliders } from 'lucide-react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/routes';
import { useT } from '@/i18n/utils';

import { ButtonWithTooltip } from '../common/button-with-tooltip';

export function AppNavbarMenu() {
  const { t } = useT();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <ButtonWithTooltip
          disableTracking
          size="icon"
          variant="ghost"
          tooltip={t('label.settings')}
          ariaLabel={t('label.settings')}
          className="relative rounded-full bg-background items-center"
        >
          <Settings className="size-5" />
          <span className="sr-only">{t('label.settings')}</span>
        </ButtonWithTooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        collisionPadding={8}
        className="w-48"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem asChild>
          <Link href={ROUTES.PREFERENCES} className="flex items-center gap-2 cursor-pointer w-full">
            <Sliders className="size-4 text-muted-foreground" />
            <span>{t('preferences.title')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.LABS} className="flex items-center gap-2 cursor-pointer w-full">
            <FlaskConical className="size-4 text-muted-foreground" />
            <span>{t('labs.title')}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
