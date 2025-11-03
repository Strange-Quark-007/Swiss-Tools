import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { DataSizeConverter } from '@/features/unit-converter/data-size/data-size-converter';
import { DATA_SIZES } from '@/features/unit-converter/data-size/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('dataSizeConverter.meta.title'),
    description: t('dataSizeConverter.meta.description'),
  };
}

export default async function AreaConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: DATA_SIZES, default: DATA_SIZES.gib.value },
    [SEARCH_PARAM_KEYS.TO]: { map: DATA_SIZES, default: DATA_SIZES.mib.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.DATA_SIZE_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('dataSizeConverter.name') },
    { label: `${DATA_SIZES[from].label} ↔ ${DATA_SIZES[to].label}` },
  ];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <DataSizeConverter from={from} to={to} />
    </PageContainer>
  );
}
