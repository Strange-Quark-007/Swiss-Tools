import { Heading } from '@/components/typography/heading';
import { Paragraph } from '@/components/typography/paragraph';
import { Text } from '@/components/typography/text';
import { getT } from '@/i18n/utils';

export const PHILOSOPHIES = [
  {
    titleKey: 'home.philosophies.zeroLecture.title',
    descriptionKey: 'home.philosophies.zeroLecture.description',
  },
  {
    titleKey: 'home.philosophies.zeroSeo.title',
    descriptionKey: 'home.philosophies.zeroSeo.description',
  },
  {
    titleKey: 'home.philosophies.essentialsOnly.title',
    descriptionKey: 'home.philosophies.essentialsOnly.description',
  },
  {
    titleKey: 'home.philosophies.consistentUX.title',
    descriptionKey: 'home.philosophies.consistentUX.description',
  },
  {
    titleKey: 'home.philosophies.standardOfExcellence.title',
    descriptionKey: 'home.philosophies.standardOfExcellence.description',
  },
] as const;

export const WhyThisToolkit = async () => {
  const { richT: t } = await getT();

  const philosophies = PHILOSOPHIES.map(({ titleKey, descriptionKey }) => ({
    title: t(titleKey),
    description: t(descriptionKey),
  }));

  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div className="text-center custom-transition-color">
        <Heading level={3} className="text-3xl md:text-4xl font-bold mb-3">
          {t('home.why.title')}
        </Heading>

        <Paragraph className="text-lg text-muted-foreground mx-auto max-w-4xl">
          {t('home.why.problem')}
          <br />
          {t('home.why.solution')}
        </Paragraph>
      </div>

      <div className="p-4 bg-secondary border rounded-md shadow-lg">
        <Text
          variant="large"
          className="font-bold text-xl mb-4 block border-b border-muted-foreground pb-2 custom-transition-color"
        >
          {t('home.philosophies.title')}
        </Text>

        <dl className="flex flex-col md:gap-2 gap-4">
          {philosophies.map((philosophy, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-2 md:items-center">
              <dt className="font-semibold text-base text-foreground min-w-48 custom-transition-color">
                {philosophy.title}:
              </dt>
              <dd className="text-sm text-foreground/60 text-balance custom-transition-color">
                {philosophy.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
