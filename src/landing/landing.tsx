import { FlexContainer } from '@/components/content-layout/flex-container';

import { Hero } from './hero';
import { WhyThisToolkit } from './why-this-toolkit';

export const Landing = () => {
  return (
    <FlexContainer direction="col" className="items-center py-10 px-10 md:px-20 gap-14">
      <Hero />
      <WhyThisToolkit />
    </FlexContainer>
  );
};
