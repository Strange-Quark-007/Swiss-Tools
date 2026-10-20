'use client';

import { cn } from 'cn';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useCallback, useEffect, useRef, useState } from 'react';

import SwissTools from '@/assets/icons/SwissTools';
import { CategoryList } from '@/components/sidebar/category-list';
import { Heading } from '@/components/typography/heading';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { appModules, staticModule } from '@/constants/app-modules';
import { customScrollbarCss } from '@/constants/common';
import { GA_EVENTS } from '@/constants/ga-events';
import { ROUTES, ROUTES_WITHOUT_SIDEBAR } from '@/constants/routes';
import { useFavorites } from '@/hooks/use-favorites';
import { useTrackEvent } from '@/hooks/use-ga-events';
import { useIsMobile } from '@/hooks/use-mobile';
import { useT } from '@/i18n/utils';
import { useAppStore } from '@/store/store';
import { AppModuleGroup } from '@/types/app-module';

export function AppSidebar() {
  const { t } = useT();
  const trackEvent = useTrackEvent();

  const router = useRouter();
  const pathname = usePathname();

  const { open } = useSidebar();
  const isMobile = useIsMobile();

  const { magicDrop } = useAppStore();
  const appModulesList = appModules(t);
  const favorites = useFavorites(appModulesList);

  const [favs, setFavs] = useState<AppModuleGroup[]>([]);

  const scrollAnimRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const startAutoScroll = useCallback((container: HTMLDivElement, speed: number) => {
    containerRef.current = container;
    scrollSpeedRef.current = speed;

    if (scrollAnimRef.current === null) {
      const step = () => {
        if (containerRef.current && scrollSpeedRef.current !== 0) {
          containerRef.current.scrollTop += scrollSpeedRef.current;
          scrollAnimRef.current = requestAnimationFrame(step);
        } else {
          scrollAnimRef.current = null;
        }
      };
      scrollAnimRef.current = requestAnimationFrame(step);
    }
  }, []);

  const stopAutoScroll = useCallback(() => {
    scrollSpeedRef.current = 0;
    if (scrollAnimRef.current !== null) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Drag can end outside the sidebar (or even outside the window), so stop
    // auto-scroll from the document-level drag lifecycle as well.
    window.addEventListener('dragend', stopAutoScroll);
    window.addEventListener('drop', stopAutoScroll);

    return () => {
      window.removeEventListener('dragend', stopAutoScroll);
      window.removeEventListener('drop', stopAutoScroll);
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    startTransition(() => {
      setFavs([favorites]);
    });
  }, [isMobile, favorites]);

  const handleContentDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!magicDrop) return;
    e.preventDefault();

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const clientY = e.clientY;

    const edgeZone = 70;
    const topThreshold = rect.top + edgeZone;
    const bottomThreshold = rect.bottom - edgeZone;

    if (clientY < topThreshold) {
      const factor = Math.min(1, Math.max(0.1, (topThreshold - clientY) / edgeZone));
      startAutoScroll(container, -Math.round(factor * 10));
    } else if (clientY > bottomThreshold) {
      const factor = Math.min(1, Math.max(0.1, (clientY - bottomThreshold) / edgeZone));
      startAutoScroll(container, Math.round(factor * 10));
    } else {
      stopAutoScroll();
    }
  };

  const handleContentDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    stopAutoScroll();
  };

  const handleContentDrop = (e: React.DragEvent<HTMLDivElement>) => {
    // The sidebar is a valid drop target while Magic Drop is active; prevent the
    // browser default (e.g. navigating to a dropped URL or opening a file).
    e.preventDefault();
    stopAutoScroll();
  };

  const ariaHidden = pathname === ROUTES.DASHBOARD;

  if (ROUTES_WITHOUT_SIDEBAR.includes(pathname as ROUTES)) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center sticky top-0 z-10 w-full h-16 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <SwissTools
          className="size-8 [[data-state=expanded]_&]:hidden [[data-mobile=true]_&]:hidden hover:cursor-pointer"
          onClick={() => router.push(ROUTES.HOME)}
        />
        <Heading
          aria-hidden={ariaHidden}
          onClick={() => router.push(ROUTES.HOME)}
          className={`flex text-nowrap transform hover:cursor-pointer ${
            open ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        >
          {t('app.name')}
        </Heading>
      </SidebarHeader>
      <SidebarContent
        className={cn('py-2 overflow-x-hidden', customScrollbarCss)}
        onDragOver={handleContentDragOver}
        onDragLeave={handleContentDragLeave}
        onDrop={handleContentDrop}
      >
        <CategoryList groups={[{ ...staticModule(t), label: '' }]} />
        <CategoryList groups={isMobile ? [favorites] : favs} />
        <CategoryList groups={appModulesList} />
      </SidebarContent>
      <SidebarFooter className="flex justify-center w-full h-16 p-2">
        <SidebarTrigger onClick={() => trackEvent(GA_EVENTS.SIDEBAR_TOGGLE)} />
      </SidebarFooter>
    </Sidebar>
  );
}
