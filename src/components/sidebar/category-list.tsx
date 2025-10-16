import { Ellipsis, Star } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Text } from '@/components/typography/text';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { GA_EVENTS } from '@/constants/gaEvents';
import { ROUTES } from '@/constants/routes';
import { useTrackEvent } from '@/hooks/use-ga-events';
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/store';
import * as Types from '@/types/app-module';

export const CategoryItem = ({ id, icon: Icon, name, tooltip }: Types.AppModuleItem) => {
  const { t } = useT();
  const trackEvent = useTrackEvent();
  const pathName = usePathname();
  const navigate = useModuleNavigation();
  const { favorites, addFavorite, removeFavorite } = useAppStore();

  const isSelected = id === pathName;
  const hideFavorite = id === ROUTES.DASHBOARD;
  const isFavorite = favorites.includes(id);

  const handleFavorite = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    if (isFavorite) {
      trackEvent(GA_EVENTS.FAV_REMOVE, { name });
      removeFavorite(id);
    } else {
      trackEvent(GA_EVENTS.FAV_ADD, { name });
      addFavorite(id);
    }
  };

  return (
    <SidebarMenuItem className="flex group/menu-hover">
      <SidebarMenuButton
        className="hover:cursor-pointer"
        type="button"
        isActive={isSelected}
        tooltip={tooltip || name}
        onClick={() => navigate(id)}
      >
        <Icon />
        <Text className="text-nowrap">{name}</Text>
        {!hideFavorite && (
          <Star
            aria-label={isFavorite ? t('label.removeFavorite') : t('label.addFavorite')}
            className={cn(
              'ml-auto opacity-0 group-hover/menu-hover:opacity-100',
              isFavorite
                ? 'group-hover/menu-hover:fill-accent-foreground hover:fill-accent-foreground/15'
                : 'hover:fill-primary/75'
            )}
            onClick={handleFavorite}
          />
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const Category = ({ label, items }: Types.AppModuleGroup) => {
  if (!items.length) {
    return null;
  }

  return (
    <SidebarGroup>
      {label && (
        <>
          <SidebarMenuButton
            type="button"
            tooltip={label}
            aria-label={label}
            className="[[data-state=expanded]_&]:hidden [[data-mobile=true]_&]:hidden"
          >
            <Ellipsis />
          </SidebarMenuButton>
          <SidebarGroupLabel className="[[data-state=collapsed]_&]:hidden">{label}</SidebarGroupLabel>
        </>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => (
            <CategoryItem key={`${label}-${item.name}-${index}`} {...item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const CategoryList = ({ groups }: Types.AppModuleList) => {
  return (
    <>
      {groups.map((category, index) => (
        <Category key={`category-${category.label}-${index}`} {...category} />
      ))}
    </>
  );
};
