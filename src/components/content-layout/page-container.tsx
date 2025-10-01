import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: Props) => {
  return (
    <div id="page-container" className={cn('flex flex-1 flex-col p-4 gap-4', className)}>
      {children}
    </div>
  );
};
