import { FlexContainer } from '@/components/content-layout/flex-container';

import { Hero } from './hero';

export const Landing = () => {
  return (
    <FlexContainer direction="col" className="flex h-full gap-0">
      <Hero />
    </FlexContainer>
  );
};
