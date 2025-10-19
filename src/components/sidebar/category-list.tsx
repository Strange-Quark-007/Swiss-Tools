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
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/store';
import * as Types from '@/types/app-module';

import { Button } from '../common/button';

export const CategoryItem = ({ id, icon: Icon, name, tooltip }: Types.AppModuleItem) => {
  const { t } = useT();
  const pathName = usePathname();
  const navigate = useModuleNavigation();
  const { favorites, addFavorite, removeFavorite } = useAppStore();

  const isSelected = id === pathName;
  const hideFavorite = id === ROUTES.DASHBOARD;
  const isFavorite = favorites.includes(id);

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <SidebarMenuItem className="flex group/menu-hover">
      <SidebarMenuButton
        asChild
        type="button"
        className="hover:cursor-pointer"
        isActive={isSelected}
        tooltip={tooltip || name}
        onClick={() => navigate(id)}
      >
        <div>
          <Icon className="custom-transition-color" />
          <Text className="text-nowrap" aria-label={name}>
            {name}
          </Text>
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
                  'ml-auto opacity-0 group-hover/menu-hover:opacity-100',
                  isFavorite
                    ? 'group-hover/menu-hover:fill-accent-foreground hover:fill-accent-foreground/15'
                    : 'hover:fill-primary/75'
                )}
              />
            </Button>
          )}
        </div>
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
            className="[[data-state=expanded]_&]:hidden [[data-mobile=true]_&]:hidden custom-transition-color"
          >
            <Ellipsis />
          </SidebarMenuButton>
          <SidebarGroupLabel className="[[data-state=collapsed]_&]:hidden custom-transition-color">
            {label}
          </SidebarGroupLabel>
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
