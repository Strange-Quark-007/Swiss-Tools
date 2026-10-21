import { cn } from 'cn';
import { ChevronRight, Ellipsis, Star } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';

import { Text } from '@/components/typography/text';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { AppModuleGroupId } from '@/constants/app-modules';
import { GA_EVENTS } from '@/constants/ga-events';
import { ROUTES } from '@/constants/routes';
import {
  isMagicDropTargetRoute,
  MAGIC_DROP_MIME_TYPE,
  transferDataToRoute,
} from '@/experiments/magic-drop/transfer-data';
import { useTrackEvent } from '@/hooks/use-ga-events';
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { useT } from '@/i18n/utils';
import { useAppStore } from '@/store/app-store';
import { usePreferencesStore } from '@/store/preferences-store';
import * as Types from '@/types/app-module';

import { Button } from '../common/button';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export const CategoryItem = ({ groupId, id, icon: Icon, name, tooltip, tag }: Types.AppModuleItem) => {
  const { t } = useT();
  const pathName = usePathname();
  const navigate = useModuleNavigation();
  const trackEvent = useTrackEvent();
  const isFavorite = useAppStore((state) => state.favorites.includes(id));
  const addFavorite = useAppStore((state) => state.addFavorite);
  const removeFavorite = useAppStore((state) => state.removeFavorite);
  const magicDrop = usePreferencesStore((state) => state.labs.magicDrop);

  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const canAcceptDrop = magicDrop && isMagicDropTargetRoute(id);

  const isSelected = id === pathName;
  const hideFavorite = id === ROUTES.DASHBOARD;

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!canAcceptDrop) return;
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!canAcceptDrop) {
      if (magicDrop) {
        e.dataTransfer.dropEffect = 'none';
      }
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!canAcceptDrop) return;
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!canAcceptDrop) return;
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    const panelPayload = e.dataTransfer.getData(MAGIC_DROP_MIME_TYPE);
    const data = panelPayload || e.dataTransfer.getData('text/plain');
    if (!data) return;

    if (!transferDataToRoute(id, data)) {
      return;
    }

    trackEvent(GA_EVENTS.MAGIC_DROP, {
      payload_type: panelPayload ? 'panel' : 'selection',
      source: pathName,
      target: id,
    });
    navigate(id);
  };

  return (
    <SidebarMenuItem
      className={cn(
        'group/menu-hover transition-all rounded-md relative',
        isDragOver && 'ring-1 ring-primary bg-primary/15 text-primary'
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <SidebarMenuButton
        asChild
        type="button"
        className="hover:cursor-pointer"
        isActive={isSelected}
        tooltip={tooltip || name}
        onClick={() => navigate(id)}
      >
        <div>
          <Icon />
          <span className="flex min-w-0 flex-1 items-center">
            <Text className="truncate" aria-label={name}>
              {name}
            </Text>
            {tag && (
              <Badge
                variant="ghost"
                className="shrink-0 tracking-wide font-[system-ui,sans-serif] text-sky-600 dark:text-sky-400 dark:font-light px-1.5 -mt-3"
              >
                {tag}
              </Badge>
            )}
          </span>
          {!hideFavorite && (
            <Button
              asChild
              variant="ghost"
              className="p-0"
              eventName={isFavorite ? GA_EVENTS.FAV_REMOVE : GA_EVENTS.FAV_ADD}
              eventParams={{ name }}
              aria-label={`${isFavorite ? t('label.removeFavorite') : t('label.addFavorite')} ${name}`}
              onClick={handleFavorite}
            >
              <Star
                className={cn(
                  'ml-auto shrink-0 hover:fill-amber-400/50',
                  groupId !== AppModuleGroupId.FAVORITES &&
                    'md:opacity-0 group-hover/menu-hover:opacity-100 group-focus-within/menu-hover:opacity-100',
                  isFavorite && 'fill-amber-400 text-amber-400'
                )}
              />
            </Button>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const Category = ({ id, label, items }: Types.AppModuleGroup) => {
  if (!items.length) {
    return null;
  }

  return (
    <Collapsible key={id} className="group/collapsible" defaultOpen>
      <SidebarGroup>
        {label && (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                type="button"
                tooltip={label}
                aria-label={label}
                className="[[data-state=expanded]_&]:hidden [[data-mobile=true]_&]:hidden hover:cursor-pointer"
              >
                <Ellipsis />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <SidebarGroupLabel asChild className="group/label [[data-state=collapsed]_&]:hidden">
              <CollapsibleTrigger aria-label={label} className="text-nowrap">
                {label}
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90 hover:cursor-pointer" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
          </>
        )}
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <CategoryItem key={`${id}-${item.name}-${index}`} groupId={id} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export const CategoryList = ({ groups }: Types.AppModuleList) => {
  return (
    <>
      {groups.map((category, index) => (
        <Category key={`category-${category.id}-${index}`} {...category} />
      ))}
    </>
  );
};
