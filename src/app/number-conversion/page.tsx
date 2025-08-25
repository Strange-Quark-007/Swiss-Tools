import { redirect } from 'next/navigation';

import { NumberConversion } from '@/features/number-conversion/number-conversion';
import { BASES } from '@/features/number-conversion/utils';
import { PageContainer } from '@/components/content-layout/page-container';
import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { ROUTES } from '@/constants/routes';
import { SearchParams } from '@/types/common';
import { getFirst } from '@/lib/utils';
import { getT } from '@/i18n/utils';

interface Props {
  searchParams: Promise<SearchParams>;
}

const validateParams = (params: SearchParams) => {
  const rawFrom = getFirst(params.from);
  const rawTo = getFirst(params.to);

  const isValidBase = (base: string | undefined): base is keyof typeof BASES => {
    return !!base && base in BASES;
  };

  const validFrom = isValidBase(rawFrom) ? rawFrom : BASES.decimal.value;
  const validTo = isValidBase(rawTo) ? rawTo : BASES.decimal.value;

  if (!isValidBase(rawFrom) || !isValidBase(rawTo)) {
    redirect(`${ROUTES.NUMBER_CONVERSION}?from=${validFrom}&to=${validTo}`);
  }

  return { from: validFrom, to: validTo };
};

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('numberConversion.meta.title'),
    description: t('numberConversion.meta.description'),
  };
}

export default async function NumberConversionPage({ searchParams }: Props) {
  const t = await getT();
  const params = await searchParams;
  const { from, to } = validateParams(params);

  const items = [
    { label: t('numberConversion.name'), href: ROUTES.NUMBER_CONVERSION },
    { label: `${BASES[from].label} → ${BASES[to].label}` },
  ];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <NumberConversion from={from} to={to} />
    </PageContainer>
  );
}
