import { cn } from '@/lib/utils';

import { FlexContainer } from './flex-container';

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  center?: React.ReactNode;
  className?: string;
}

export const SplitView = ({ left, right, center, className }: Props) => {
  return (
    <FlexContainer direction="col" className={cn('w-full h-full flex-col lg:flex-row', className)}>
      {left}
      {center}
      {right}
    </FlexContainer>
  );
};
