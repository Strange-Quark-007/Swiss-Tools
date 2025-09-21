import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: Props) => {
  return (
    <div id="page-container" className={cn('flex flex-col h-full p-4 gap-4', className)}>
      {children}
    </div>
  );
};
