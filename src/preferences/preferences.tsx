import { BackButton } from '@/components/common/back-button';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Heading } from '@/components/typography/heading';
import { Paragraph } from '@/components/typography/paragraph';
import { getT } from '@/i18n/utils';

import { DataRetentionPreferences } from './data-retention-preferences';

export const Preferences = async () => {
  const { richT: t } = await getT();

  return (
    <FlexContainer direction="col" className="p-16 gap-8 flex flex-col min-h-0 items-center py-10 px-10 md:px-20">
      <section className="w-full max-w-4xl mx-auto">
        <BackButton />
        <div className="flex flex-col gap-4 items-center text-center">
          <Heading className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl text-balance">
            {t('preferences.title')}
          </Heading>
          <Paragraph className="text-lg font-medium text-muted-foreground text-balance max-w-2xl">
            {t('preferences.subtitle')}
          </Paragraph>
        </div>
        <DataRetentionPreferences />
      </section>
    </FlexContainer>
  );
};
