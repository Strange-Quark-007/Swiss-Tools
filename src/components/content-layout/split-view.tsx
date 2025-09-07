import { cn } from '@/lib/utils';

import { FlexContainer } from './flex-container';

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  center?: React.ReactNode;
  className?: string;
}

export const SplitView = ({ left, right, center, className }: Props) => {
  const hasCenter = !!center;

  return (
    <FlexContainer direction="row" className={cn('w-full gap-4 h-full', className)}>
      {left}
      {hasCenter && <div className="flex flex-col justify-center items-center gap-2">{center}</div>}
      {right}
    </FlexContainer>
  );
};
