import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JsonLd } from '@/components/seo/json-ld';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { TimeConverter } from '@/features/unit-converter/time/time-converter';
import { TIMES } from '@/features/unit-converter/time/utils';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/lib/json-ld';
import { createToolMetadata } from '@/lib/metadata';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.TIME_CONVERTER);
}

export default async function TimeConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: TIMES, default: TIMES.s.value },
    [SEARCH_PARAM_KEYS.TO]: { map: TIMES, default: TIMES.min.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.TIME_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('timeConverter.name') },
    { label: `${TIMES[from].label} ↔ ${TIMES[to].label}` },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('timeConverter.name'),
          description: t('timeConverter.meta.description'),
          path: ROUTES.TIME_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('unitConverter.name'), url: ROUTES.LENGTH_CONVERTER },
          { name: t('timeConverter.name'), url: ROUTES.TIME_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <TimeConverter from={from} to={to} />
    </PageContainer>
  );
}
