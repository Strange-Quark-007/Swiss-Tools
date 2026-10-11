import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { DataFormatConverter } from '@/features/data-format-converter/data-format-converter';
import { DATA_FORMATS } from '@/features/data-format-converter/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { JsonLd } from '@/seo/json-ld';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.DATA_FORMAT_CONVERTER);
}

export default async function DataFormatConverterPage({ searchParams }: Props) {
  const { t } = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: DATA_FORMATS, default: DATA_FORMATS.json.value },
    [SEARCH_PARAM_KEYS.TO]: { map: DATA_FORMATS, default: DATA_FORMATS.yaml.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.DATA_FORMAT_CONVERTER);

  const items = [
    { label: t('dataFormatConverter.name') },
    { label: `${DATA_FORMATS[from].label} ↔ ${DATA_FORMATS[to].label}` },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('dataFormatConverter.name'),
          description: t('dataFormatConverter.meta.description'),
          path: ROUTES.DATA_FORMAT_CONVERTER,
          category: 'DeveloperApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('dataFormatConverter.name'), url: ROUTES.DATA_FORMAT_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <DataFormatConverter from={from} to={to} />
    </PageContainer>
  );
}
