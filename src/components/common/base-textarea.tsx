import { cn } from '@/lib/utils';

import { Textarea } from '../ui/textarea';

interface Props extends React.ComponentProps<'textarea'> {
  error?: boolean;
}

export const BaseTextarea = ({ error, className, ...props }: Props) => {
  return (
    <Textarea
      className={cn(
        'font-mono break-all resize-none text-wrap',
        'transition-colors duration-300',
        'scrollbar-thin scrollbar-thin-xs scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
        'scrollbar-thumb-muted-foreground scrollbar-track-muted',
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
