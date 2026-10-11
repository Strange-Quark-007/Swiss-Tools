import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { Heading } from '@/components/typography/heading';
import { Paragraph } from '@/components/typography/paragraph';
import { Text } from '@/components/typography/text';
import { getT } from '@/i18n/utils';

export const PRIVACY_SECTIONS = [
  { titleKey: 'privacy.dataCollection.title', textKey: 'privacy.dataCollection.text' },
  { titleKey: 'privacy.cookies.title', textKey: 'privacy.cookies.text' },
  { titleKey: 'privacy.thirdParties.title', textKey: 'privacy.thirdParties.text' },
  { titleKey: 'privacy.security.title', textKey: 'privacy.security.text' },
  { titleKey: 'privacy.changes.title', textKey: 'privacy.changes.text' },
] as const;

export const Privacy = async () => {
  const { richT: t } = await getT();

  const list = PRIVACY_SECTIONS.map(({ titleKey, textKey }) => ({
    title: t(titleKey),
    text: t(textKey),
  }));

  return (
    <FlexContainer direction="col" className="p-16 gap-8 flex flex-col min-h-0 items-center py-10 px-10 md:px-20">
      <section className="w-full max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <MoveLeft className="w-4 h-4 mr-2" />
          {t('label.home')}
        </Link>
        <div className="flex flex-col gap-4 items-center text-center">
          <Heading className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl text-balance">
            {t('privacy.title')}
          </Heading>
          <Paragraph className="text-lg font-medium text-muted-foreground text-balance max-w-2xl">
            {t('privacy.subtitle')}
          </Paragraph>
        </div>
      </section>

      <section className="w-full max-w-4xl mx-auto flex flex-col gap-4">
        {list.map(({ title, text }, idx) => (
          <div key={idx}>
            <Text variant="large" className="pb-1">
              {title}
            </Text>
            <Text className="text-foreground/70 text-sm">{text}</Text>
          </div>
        ))}
        <Text className="text-sm font-semibold text-foreground/80 pt-3">{t('privacy.lastUpdated')}</Text>
      </section>
    </FlexContainer>
  );
};
