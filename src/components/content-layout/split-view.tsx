import { cn } from '@/lib/utils';

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  center?: React.ReactNode;
  className?: string;
}

export const SplitView = ({ left, right, center, className }: Props) => {
  const hasCenter = !!center;
  return (
    <div
      id="split-view"
      className={cn(
        'h-full flex flex-col justify-between lg:grid gap-6 min-h-0',
        hasCenter ? 'lg:grid-cols-[1fr_auto_1fr]' : 'lg:grid-cols-2',
        className
      )}
    >
      {left}
      {center}
      {right}
    </div>
  );
};
