'use client';

import { Sun, MoonStar } from 'lucide-react';
import { useTheme } from 'next-themes';

import { GA_EVENTS } from '@/constants/gaEvents';
import { useT } from '@/i18n/utils';

import { Button } from '../common/button';

export function ToggleTheme() {
  const { t } = useT();
  const { theme, setTheme } = useTheme();

  return (
    <Button
      eventName={GA_EVENTS.THEME_TOGGLE}
      size="icon"
      type="button"
      variant="ghost"
      className="relative rounded-full bg-background items-center"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="absolute size-5 rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
      <MoonStar className="absolute size-5 -rotate-90 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-180 dark:scale-0" />
      <span className="sr-only">{t('sr.toggleTheme')}</span>
    </Button>
  );
}
