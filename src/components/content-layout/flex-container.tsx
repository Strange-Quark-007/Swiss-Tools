import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  direction: 'row' | 'col';
  gap?: number;
  className?: string;
}

export const FlexContainer = ({ children, direction, gap = 4, className }: Props) => {
  return <div className={cn(`flex flex-${direction} gap-${gap}`, className)}>{children}</div>;
};
