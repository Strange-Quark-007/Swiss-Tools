import { Fragment } from 'react';

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
            <Fragment key={item.label}>
              <BreadcrumbItem>
                {isLast && <BreadcrumbPage>{label}</BreadcrumbPage>}
                {!isLast && (
                  <BreadcrumbLink href={item.href} className={item.href ? '' : 'pointer-events-none'}>
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
