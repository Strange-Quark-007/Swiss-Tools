import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: Props) => {
  return (
    <div className={cn('flex flex-1 flex-col h-[80vh] md:h-[50vh] lg:h-11/12 p-4 gap-4', className)}>{children}</div>
  );
};
