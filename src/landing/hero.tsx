import { CheckCircle, Package, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

import { Paragraph } from '@/components/typography/paragraph';
import { Heading } from '@/components/typography/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';
import { Text } from '@/components/typography/text';

export const Hero = async () => {
  const { t, richT } = await getT();

  return (
    <section className="flex flex-col gap-6 items-center text-center py-20 px-10 bg-background">
      <Heading className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl text-balance">
        {t('home.hero.heading')}
        <div className="relative hidden sm:flex">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        </div>
      </Heading>

      <Paragraph className="text-lg font-medium text-balance max-w-2xl">{t('home.hero.paragraph')}</Paragraph>

      <div className="flex flex-wrap justify-center gap-2 py-2">
        <div className="flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1.5 min-w-40">
            <ShieldCheck className="size-4" />
            {t('home.badge.privacy')}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1.5 min-w-40">
            <Zap className="size-4" />
            {t('home.badge.fast')}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1.5 min-w-40">
            <Package className="size-4" />
            {t('home.badge.toolbox')}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1.5 min-w-40">
            <CheckCircle className="size-4" />
            {t('home.badge.reliable')}
          </Badge>
        </div>
      </div>

      <div className="flex gap-2">
        <Button asChild>
          <Link href={ROUTES.DASHBOARD}>{t('home.hero.mainCta')}</Link>
        </Button>
      </div>
      <Text variant="small" className="opacity-70" muted>
        {richT('home.hero.tagline')}
      </Text>
    </section>
  );
};
