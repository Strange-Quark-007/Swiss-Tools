import { customScrollbarCss } from '@/constants/common';
import { cn } from '@/lib/utils';

import { Textarea } from '../ui/textarea';

interface Props extends React.ComponentProps<'textarea'> {
  error?: boolean;
}

export const BaseTextarea = ({ error, className, ...props }: Props) => {
  return (
    <Textarea
      className={cn(
        'font-mono break-words sm:break-all lg:break-words resize-none text-wrap min-h-0',
        'transition-colors duration-300',
        customScrollbarCss,
        error ? 'border-destructive focus-visible:border-destructive text-red-400' : '',
        className
      )}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      {...props}
    />
  );
};
