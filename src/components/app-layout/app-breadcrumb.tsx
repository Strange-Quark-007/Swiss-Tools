import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';
import { cn } from '@/lib/utils';

import { Text } from '../typography/text';

type BreadcrumbData = {
  label: string;
  href?: string;
};

interface AppBreadcrumbProps {
  items: BreadcrumbData[];
}

export const AppBreadcrumb = async ({ items }: AppBreadcrumbProps) => {
  const t = await getT();
  const breadcrumbs = [{ label: t('dashboard.name'), href: ROUTES.DASHBOARD }, ...items];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === breadcrumbs.length - 1;
          const label = <Text>{item.label}</Text>;
          return (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                {isFirst && (
                  <BreadcrumbLink
                    href={item.href}
                    asChild={!item.href}
                    className={cn('xs:hidden block', item.href ? '' : 'pointer-events-none')}
                  >
                    {label}
                  </BreadcrumbLink>
                )}
                {isLast && <BreadcrumbPage>{label}</BreadcrumbPage>}
                {!isFirst && !isLast && <BreadcrumbEllipsis className="xs:hidden" />}
                {!isLast && (
                  <BreadcrumbLink
                    href={item.href}
                    asChild={!item.href}
                    className={cn('hidden xs:block', item.href ? '' : 'pointer-events-none')}
                  >
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
