import { cn } from 'cn';

interface Props {
  children: React.ReactNode;
  direction: 'row' | 'col';
  className?: string;
  id?: string;
}

export const FlexContainer = ({ id = 'flex-container', children, direction, className }: Props) => {
  return (
    <div id={id} className={cn(`flex flex-${direction} gap-4 min-h-0`, className)}>
      {children}
    </div>
  );
};
