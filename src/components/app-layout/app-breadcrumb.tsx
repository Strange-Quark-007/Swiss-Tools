import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { Text } from '../typography/text';

type BreadcrumbData = {
  label: string;
  href?: string;
};

interface AppBreadcrumbProps {
  items: BreadcrumbData[];
}

export const AppBreadcrumb = ({ items }: AppBreadcrumbProps) => {
  const breadcrumbs = [{ label: 'Home', href: '/' }, ...items];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          const label = <Text>{item.label}</Text>;
          return (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
