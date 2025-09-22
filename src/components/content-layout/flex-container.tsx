import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  direction: 'row' | 'col';
  className?: string;
  id?: string;
}

export const FlexContainer = ({ id = 'flex-container', children, direction, className }: Props) => {
  return (
    <div id={id} className={cn(`flex flex-${direction} gap-4`, className)}>
      {children}
    </div>
  );
};
