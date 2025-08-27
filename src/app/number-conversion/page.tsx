import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { NumberConversion } from '@/features/number-conversion/number-conversion';
import { BASES } from '@/features/number-conversion/utils';
import { validateParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';

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
