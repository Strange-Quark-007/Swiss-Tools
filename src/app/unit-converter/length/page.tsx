import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { LengthConverter } from '@/features/length-converter/length-converter';
import { LENGTHS } from '@/features/length-converter/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('lengthConverter.meta.title'),
    description: t('lengthConverter.meta.description'),
  };
}

export default async function LengthConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: LENGTHS, default: LENGTHS.m.value },
    [SEARCH_PARAM_KEYS.TO]: { map: LENGTHS, default: LENGTHS.ft.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.LENGTH_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('lengthConverter.name') },
    { label: `${LENGTHS[from].label} ↔ ${LENGTHS[to].label}` },
  ];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <LengthConverter from={from} to={to} />
    </PageContainer>
  );
}
