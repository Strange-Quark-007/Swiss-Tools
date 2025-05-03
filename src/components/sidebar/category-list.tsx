import { usePathname } from 'next/navigation';
import { Ellipsis } from 'lucide-react';

import * as Types from '@/types/app-module';
import { Text } from '@/components/typography/text';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export const CategoryItem = ({ icon: Icon, name, tooltip, isSelected, onSelect }: Types.AppModuleItem) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton type="button" isActive={isSelected} tooltip={tooltip || name} onClick={onSelect}>
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
          <SidebarMenuButton type="button" tooltip={label} className="[[data-side=left][data-state=expanded]_&]:hidden">
            <Ellipsis />
          </SidebarMenuButton>
          <SidebarGroupLabel className="[[data-side=left][data-state=collapsed]_&]:hidden">{label}</SidebarGroupLabel>
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
