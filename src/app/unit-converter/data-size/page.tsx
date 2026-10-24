import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { DataSizeConverter } from '@/features/unit-converter/data-size/data-size-converter';
import { DATA_SIZES } from '@/features/unit-converter/data-size/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { generateBreadcrumbJsonLd, generateToolJsonLd, JsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.DATA_SIZE_CONVERTER);
}

export default async function DataSizeConverterPage({ searchParams }: Props) {
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
      <JsonLd
        data={generateToolJsonLd({
          name: t('dataSizeConverter.name'),
          description: t('dataSizeConverter.meta.description'),
          path: ROUTES.DATA_SIZE_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('unitConverter.name'), url: ROUTES.LENGTH_CONVERTER },
          { name: t('dataSizeConverter.name'), url: ROUTES.DATA_SIZE_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <DataSizeConverter from={from} to={to} />
    </PageContainer>
  );
}
