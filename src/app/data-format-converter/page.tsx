import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { DataFormatConverter } from '@/features/data-format-converter/data-format-converter';
import { DATA_FORMATS } from '@/features/data-format-converter/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { SearchParams } from '@/types/common';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('dataFormatConverter.meta.title'),
    description: t('dataFormatConverter.meta.description'),
  };
}

export default async function DataFormatConverterPage({ searchParams }: Props) {
  const t = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: DATA_FORMATS, default: DATA_FORMATS.json.value },
    [SEARCH_PARAM_KEYS.TO]: { map: DATA_FORMATS, default: DATA_FORMATS.yaml.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.DATA_FORMAT_CONVERTER);

  const items = [
    { label: t('dataFormatConverter.name') },
    { label: `${DATA_FORMATS[from].label} → ${DATA_FORMATS[to].label}` },
  ];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <DataFormatConverter from={from} to={to} />
    </PageContainer>
  );
}
