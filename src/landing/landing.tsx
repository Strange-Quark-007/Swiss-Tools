import { FlexContainer } from '@/components/content-layout/flex-container';
import { Footer } from '@/components/app-layout/app-footer';

import { Hero } from './hero';

export const Landing = () => {
  return (
    <FlexContainer direction="col" className="flex h-full gap-0">
      <Hero />
      <Footer />
    </FlexContainer>
  );
};
