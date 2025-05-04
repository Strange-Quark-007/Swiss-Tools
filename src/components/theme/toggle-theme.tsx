'use client';

import { useTheme } from 'next-themes';
import { Sun, MoonStar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useT } from '@/i18n/utils';

export function ToggleTheme() {
  const t = useT();
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      type="button"
      variant="ghost"
      className="relative rounded-full bg-background items-center hover:cursor-pointer"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="absolute size-5 rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
      <MoonStar className="absolute size-5 -rotate-90 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-180 dark:scale-0" />
      <span className="sr-only">{t('sr.toggleTheme')}</span>
    </Button>
  );
}
