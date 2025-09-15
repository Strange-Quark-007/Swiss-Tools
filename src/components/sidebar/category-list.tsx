import { usePathname } from 'next/navigation';
import { Ellipsis } from 'lucide-react';

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
import * as Types from '@/types/app-module';

export const CategoryItem = ({ id, icon: Icon, name, tooltip, isSelected }: Types.AppModuleItem) => {
  const navigate = useModuleNavigation();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="hover:cursor-pointer"
        type="button"
        isActive={isSelected}
        tooltip={tooltip || name}
        onClick={() => navigate(id)}
      >
        <Icon className="size-4" />
        <Text className="text-nowrap">{name}</Text>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const Category = ({ label, items }: Types.AppModuleGroup) => {
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
  const pathName = usePathname();

  const enhancedGroups = groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isSelected: item.id === pathName,
    })),
  }));

  return (
    <>
      {enhancedGroups.map((category, index) => (
        <Category key={`category-${category.label}-${index}`} {...category} />
      ))}
    </>
  );
};
