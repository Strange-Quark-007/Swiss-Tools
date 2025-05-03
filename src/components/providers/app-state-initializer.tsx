'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useAppStore } from '@/store/store';
import { getPageTitle } from '@/lib/utils';

export const AppStateInitializer = () => {
  const pathname = usePathname();
  const t = useTranslations();
  const setNavbarTitle = useAppStore((s) => s.setNavbarTitle);

  useEffect(() => {
    const resolvedTitle = getPageTitle(pathname, t);
    setNavbarTitle(resolvedTitle);
  }, [pathname, t, setNavbarTitle]);

  return null;
};
