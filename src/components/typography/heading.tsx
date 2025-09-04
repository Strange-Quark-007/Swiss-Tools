import React from 'react';

import { cn } from '@/lib/utils';

type HeadingLevel = 1 | 2 | 3 | 4;
type LevelMap = Record<HeadingLevel, { tag: React.ElementType; class: string }>;
type HeadingProps = React.HTMLAttributes<HTMLElement> & {
  level?: HeadingLevel;
  className?: string;
  muted?: boolean;
  children: React.ReactNode;
};

const levelMap: LevelMap = {
  1: { tag: 'h1', class: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl' },
  2: { tag: 'h2', class: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0' },
  3: { tag: 'h3', class: 'scroll-m-20 text-2xl font-semibold tracking-tight' },
  4: { tag: 'h4', class: 'scroll-m-20 text-xl font-semibold tracking-tight' },
};

export function Heading({ level = 1, className, muted, children, ...props }: HeadingProps) {
  const { tag: Tag, class: baseClass } = levelMap[level];
  const mutedClass = muted ? 'text-muted-foreground' : '';

  return (
    <Tag className={cn(baseClass, mutedClass, className)} {...props}>
      {children}
    </Tag>
  );
}
