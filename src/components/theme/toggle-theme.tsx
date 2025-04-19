'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      type="button"
      variant="ghost"
      className="relative rounded-full bg-background items-center"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Moon className="absolute size-5 rotate-0 scale-100 transition-transform duration-500 dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute size-5 rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
