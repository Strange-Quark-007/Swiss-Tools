import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  direction: 'row' | 'col';
  className?: string;
}

export const FlexContainer = ({ children, direction, className }: Props) => {
  return (
    <div id="flex-container" className={cn(`flex flex-${direction} gap-4`, className)}>
      {children}
    </div>
  );
};
