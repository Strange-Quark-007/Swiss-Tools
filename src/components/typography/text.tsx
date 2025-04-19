import React from 'react';

import { cn } from '@/lib/utils';

type TextVariants = 'inlineCode' | 'lead' | 'large' | 'small';

type TextProps = React.HTMLAttributes<HTMLElement> & {
  variant?: TextVariants;
  muted?: boolean;
  children: React.ReactNode;
};

export function Text({ variant = 'small', muted = false, className, children, ...props }: TextProps) {
  let Component: React.ElementType;
  let baseClass = '';

  switch (variant) {
    case 'inlineCode':
      Component = 'code';
      baseClass = 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold';
      break;
    case 'lead':
      Component = 'p';
      baseClass = 'text-xl text-muted-foreground';
      break;
    case 'large':
      Component = 'div';
      baseClass = 'text-lg font-semibold';
      break;
    case 'small':
      Component = 'small';
      baseClass = 'text-sm font-medium leading-none';
      break;
  }

  const mutedClass = muted ? 'text-muted-foreground' : '';

  return (
    <Component className={cn(baseClass, mutedClass, className)} {...props}>
      {children}
    </Component>
  );
}
