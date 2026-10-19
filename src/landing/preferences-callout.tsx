import { ArrowRight, Database } from 'lucide-react';
import Link from 'next/link';

import { Paragraph } from '@/components/typography/paragraph';
import { Text } from '@/components/typography/text';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';

export const PreferencesCallout = async () => {
  const { t, richT } = await getT();

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-md shadow-sm dark:shadow-secondary bg-muted/20 border border-border/40 p-3 sm:p-3.5 pl-4 sm:pl-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
        <span
          className="absolute left-0 top-0 bottom-0 w-1 border-border/40 bg-primary/40 dark:bg-primary/45"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-2">
            <Database className="size-4 text-primary shrink-0" />
            <Text className="font-semibold text-base text-foreground">{t('home.preferencesCallout.title')}</Text>
          </div>
          <Paragraph className="text-xs sm:text-sm text-foreground/60 leading-relaxed">
            {richT('home.preferencesCallout.description')}
          </Paragraph>
        </div>
        <Link
          href={ROUTES.PREFERENCES}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground/90 hover:text-primary transition-colors underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-primary shrink-0 group self-start sm:self-auto"
        >
          <span>{t('home.preferencesCallout.cta')}</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
};
