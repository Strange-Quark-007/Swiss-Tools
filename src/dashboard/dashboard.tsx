import { FlexContainer } from '@/components/content-layout/flex-container';
import { Paragraph } from '@/components/typography/paragraph';
import { Heading } from '@/components/typography/heading';
import { getT } from '@/i18n/utils';

import { ModulesList } from './modules-list';

export const Dashboard = async () => {
  const { t } = await getT();

  return (
    <FlexContainer direction="col" className="p-16 gap-16">
      <section className="flex flex-col gap-6 items-center text-center bg-background">
        <Heading className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl text-balance">
          {t('dashboard.title')}
        </Heading>
        <Paragraph className="text-lg font-medium text-balance max-w-2xl">{t('dashboard.paragraph')}</Paragraph>
      </section>
      <ModulesList />
    </FlexContainer>
  );
};
