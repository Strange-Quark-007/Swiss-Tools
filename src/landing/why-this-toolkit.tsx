import { Heading } from '@/components/typography/heading';
import { Paragraph } from '@/components/typography/paragraph';
import { Text } from '@/components/typography/text';
import { getT } from '@/i18n/utils';

export const WhyThisToolkit = async () => {
  const { richT: t } = await getT();
  const philosophies = [
    {
      title: t('home.philosophies.zeroLecture.title'),
      description: t('home.philosophies.zeroLecture.description'),
    },
    {
      title: t('home.philosophies.zeroSeo.title'),
      description: t('home.philosophies.zeroSeo.description'),
    },
    {
      title: t('home.philosophies.essentialsOnly.title'),
      description: t('home.philosophies.essentialsOnly.description'),
    },
    {
      title: t('home.philosophies.consistentUX.title'),
      description: t('home.philosophies.consistentUX.description'),
    },
    {
      title: t('home.philosophies.standardOfExcellence.title'),
      description: t('home.philosophies.standardOfExcellence.description'),
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <Heading level={3} className="text-3xl md:text-4xl font-bold mb-3">
          {t('home.why.title')}
        </Heading>

        <Paragraph className="text-lg text-muted-foreground mx-auto max-w-4xl">
          {t('home.why.problem')}
          <br />
          {t('home.why.solution')}
        </Paragraph>
      </div>

      <div className="p-4 bg-secondary dark:bg-secondary/40 border rounded-md shadow-lg">
        <Text variant="large" className="font-bold text-xl mb-4 block border-b pb-2">
          {t('home.philosophies.title')}
        </Text>

        <dl className="flex flex-col md:gap-2 gap-4">
          {philosophies.map((philosophy, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-2 md:items-center">
              <dt className="font-semibold text-base text-foreground min-w-48">{philosophy.title}:</dt>
              <dd className="text-sm text-foreground/60 text-balance">{philosophy.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
