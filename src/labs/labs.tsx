import { BackButton } from '@/components/common/back-button';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Heading } from '@/components/typography/heading';
import { Paragraph } from '@/components/typography/paragraph';
import { Badge } from '@/components/ui/badge';
import { getT } from '@/i18n/utils';
import { LabsFeatures } from '@/labs/labs-features';

export const Labs = async () => {
  const { richT: t } = await getT();

  return (
    <FlexContainer direction="col" className="p-16 gap-8 flex flex-col min-h-0 items-center py-10 px-10 md:px-20">
      <section className="w-full max-w-4xl mx-auto">
        <BackButton />
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="flex items-start gap-3">
            <Heading className="text-4xl md:text-5xl font-bold tracking-tight text-balance">{t('labs.title')}</Heading>
            <Badge className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500 font-semibold text-xs px-2.5 py-0.5 border-transparent">
              {t('labs.badge')}
            </Badge>
          </div>
          <Paragraph className="text-lg font-medium text-muted-foreground text-balance max-w-2xl">
            {t('labs.subtitle', { classNames: { strong: 'text-foreground/70' } })}
          </Paragraph>
        </div>
        <LabsFeatures />
      </section>
    </FlexContainer>
  );
};
