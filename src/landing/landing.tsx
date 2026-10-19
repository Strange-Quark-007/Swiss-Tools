import { FlexContainer } from '@/components/content-layout/flex-container';

import { Hero } from './hero';
import { PreferencesCallout } from './preferences-callout';
import { WhyThisToolkit } from './why-this-toolkit';

export const Landing = () => {
  return (
    <FlexContainer direction="col" className="items-center p-10 md:px-20 gap-8">
      <Hero />
      <WhyThisToolkit />
      <PreferencesCallout />
    </FlexContainer>
  );
};
