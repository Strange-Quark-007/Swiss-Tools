import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  left: ReactNode;
  right: ReactNode;
  center?: ReactNode;
  className?: string;
}

export const SplitView = ({ left, right, center, className }: Props) => {
  const hasCenter = !!center;

  return (
    <div className={cn('gap-4 grid h-full lg:h-11/12', hasCenter ? 'lg:grid-cols-3' : 'lg:grid-cols-2', className)}>
      {left}
      {hasCenter && <div className="flex flex-col justify-center items-center gap-2">{center}</div>}
      {right}
    </div>
  );
};
