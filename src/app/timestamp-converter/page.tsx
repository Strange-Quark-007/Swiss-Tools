import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { TimestampConverter } from '@/features/timestamp-converter/timestamp-converter';
import { TIMESTAMP_FORMATS } from '@/features/timestamp-converter/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { generateBreadcrumbJsonLd, generateToolJsonLd, JsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.TIMESTAMP_CONVERTER);
}

export default async function TimestampConverterPage({ searchParams }: Props) {
  const { t } = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: TIMESTAMP_FORMATS, default: TIMESTAMP_FORMATS.unixSec.value },
    [SEARCH_PARAM_KEYS.TO]: { map: TIMESTAMP_FORMATS, default: TIMESTAMP_FORMATS.iso8601.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.TIMESTAMP_CONVERTER);

  const items = [
    { label: t('timestampConverter.name') },
    { label: `${TIMESTAMP_FORMATS[from].label} ↔ ${TIMESTAMP_FORMATS[to].label}` },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('timestampConverter.name'),
          description: t('timestampConverter.meta.description'),
          path: ROUTES.TIMESTAMP_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('timestampConverter.name'), url: ROUTES.TIMESTAMP_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <TimestampConverter from={from} to={to} />
    </PageContainer>
  );
}
