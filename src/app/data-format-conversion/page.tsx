import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { DATA_FORMATS } from '@/features/data-format-conversion/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';
import { SearchParams } from '@/types/common';
import { DataFormatConversion } from '@/features/data-format-conversion/data-format-conversion';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('dataFormatConversion.meta.title'),
    description: t('dataFormatConversion.meta.description'),
  };
}

export default async function DataFormatConversionPage({ searchParams }: Props) {
  const t = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: DATA_FORMATS, default: DATA_FORMATS.json.value },
    [SEARCH_PARAM_KEYS.TO]: { map: DATA_FORMATS, default: DATA_FORMATS.json.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.DATA_FORMAT_CONVERSION);

  const items = [
    { label: t('dataFormatConversion.name'), href: ROUTES.DATA_FORMAT_CONVERSION },
    { label: `${DATA_FORMATS[from].label} → ${DATA_FORMATS[to].label}` },
  ];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <DataFormatConversion from={from} to={to} />
    </PageContainer>
  );
}
