import { MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Ellipsis, Star } from 'lucide-react';

import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { Text } from '@/components/typography/text';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';
import * as Types from '@/types/app-module';
import { useAppStore } from '@/store/store';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';

export const CategoryItem = ({ id, icon: Icon, name, tooltip }: Types.AppModuleItem) => {
  const t = useT();
  const pathName = usePathname();
  const navigate = useModuleNavigation();
  const { favorites, addFavorite, removeFavorite } = useAppStore();

  const isSelected = id === pathName;
  const hideFavorite = id === ROUTES.DASHBOARD;
  const isFavorite = favorites.includes(id);

  const handleFavorite = (e: MouseEvent<SVGSVGElement>) => {
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
            aria-label={isFavorite ? t('label.addFavorite') : t('label.removeFavorite')}
            className={cn(
              'ml-auto',
              isFavorite
                ? 'opacity-100 fill-accent-foreground hover:fill-primary-foreground'
                : 'opacity-0 group-hover/menu-hover:opacity-100 hover:fill-primary'
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
