'use client';

import { FlaskConical, Settings, Sliders } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
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
    <>
      <div className="hidden md:flex items-center gap-2">
        <ButtonWithTooltip
          asChild
          disableTracking
          size="icon"
          variant="ghost"
          tooltip={t('labs.title')}
          ariaLabel={t('labs.title')}
          className="relative rounded-full bg-background items-center"
        >
          <Link href={ROUTES.LABS} className="relative flex items-center justify-center">
            <FlaskConical className="size-5" />
            <span className="sr-only">{t('labs.title')}</span>
            <span
              data-slot="labs-dot"
              className="absolute top-1.5 right-1 size-1.5 rounded-full bg-blue-500 ring-2 ring-background pointer-events-none"
            />
          </Link>
        </ButtonWithTooltip>
        <ButtonWithTooltip
          asChild
          disableTracking
          size="icon"
          variant="ghost"
          tooltip={t('preferences.title')}
          ariaLabel={t('preferences.title')}
          className="relative rounded-full bg-background items-center"
        >
          <Link href={ROUTES.PREFERENCES}>
            <Sliders className="size-5" />
            <span className="sr-only">{t('preferences.title')}</span>
          </Link>
        </ButtonWithTooltip>
      </div>

      <div className="flex md:hidden">
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
              <Link href={ROUTES.LABS} className="flex items-center justify-between cursor-pointer w-full">
                <div className="flex items-center gap-2">
                  <FlaskConical className="size-4 text-muted-foreground" />
                  <span>{t('labs.title')}</span>
                </div>
                <Badge className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500 border-transparent text-[11px] px-1.5 py-0 h-4 font-normal">
                  {t('label.experimental')}
                </Badge>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
