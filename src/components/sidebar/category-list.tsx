import React from 'react';
import { Ellipsis } from 'lucide-react';

import * as Types from '@/types/sidebar';
import { Text } from '@/components/typography/text';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export const CategoryItem = ({ icon: Icon, name, tooltip, isSelected, onSelect }: Types.CategoryItem) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton type="button" isActive={isSelected} tooltip={tooltip || name} onClick={onSelect}>
        <Icon className="size-4" />
        <Text>{name}</Text>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const Category = ({ label, items }: Types.Category) => {
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

export const CategoryList = ({ categories }: Types.CategoryList) => {
  return (
    <>
      {categories.map((category, index) => (
        <Category key={`category-${category.label}-${index}`} {...category} />
      ))}
    </>
  );
};
