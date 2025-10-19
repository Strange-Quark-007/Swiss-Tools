import { cn } from '@/lib/utils';

type ParagraphProps = React.HTMLAttributes<HTMLElement> & {
  isBlockquote?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Paragraph({ isBlockquote = false, className, children, ...props }: ParagraphProps) {
  const Component = isBlockquote ? 'blockquote' : 'p';
  const baseClass = isBlockquote ? 'mt-6 border-l-2 pl-6 italic' : 'leading-7';

  return (
    <Component className={cn(baseClass, 'custom-transition-color', className)} {...props}>
      {children}
    </Component>
  );
}
