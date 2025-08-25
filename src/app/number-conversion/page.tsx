import { NumberConversion } from '@/features/number-conversion/number-conversion';
import { BASES } from '@/features/number-conversion/utils';
import { PageContainer } from '@/components/content-layout/page-container';
import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { ROUTES } from '@/constants/routes';
import { SearchParams } from '@/types/common';
import { getT } from '@/i18n/utils';
import { validateParams } from '@/lib/validate-params';

interface Props {
  searchParams: Promise<SearchParams>;
}

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
  const { from, to } = validateParams(params, BASES, BASES.decimal.value, ROUTES.NUMBER_CONVERSION);

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
