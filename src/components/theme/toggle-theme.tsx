'use client';

import { MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { flushSync } from 'react-dom';

import { GA_EVENTS } from '@/constants/ga-events';
import { useT } from '@/i18n/utils';

import { ButtonWithTooltip } from '../common/button-with-tooltip';

export function ToggleTheme() {
  const { t } = useT();
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    if (typeof document === 'undefined' || !document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });
  };

  return (
    <ButtonWithTooltip
      eventName={GA_EVENTS.THEME_TOGGLE}
      size="icon"
      type="button"
      variant="ghost"
      className="relative rounded-full bg-background items-center"
      tooltip={t('label.toggleTheme')}
      ariaLabel={t('label.toggleTheme')}
      onClick={handleToggle}
    >
      <Sun className="absolute size-5 rotate-90 scale-0 transition-transform ease-in-out duration-300 dark:rotate-0 dark:scale-100" />
      <MoonStar className="absolute size-5 -rotate-90 scale-100 transition-transform ease-in-out duration-300 dark:-rotate-180 dark:scale-0" />
      <span className="sr-only">{t('label.toggleTheme')}</span>
    </ButtonWithTooltip>
  );
}
