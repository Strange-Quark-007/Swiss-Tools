import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JsonLd } from '@/components/seo/json-ld';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { WEIGHTS } from '@/features/unit-converter/weight/utils';
import { WeightConverter } from '@/features/unit-converter/weight/weight-converter';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/lib/json-ld';
import { createToolMetadata } from '@/lib/metadata';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.WEIGHT_CONVERTER);
}

export default async function WeightConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: WEIGHTS, default: WEIGHTS.kg.value },
    [SEARCH_PARAM_KEYS.TO]: { map: WEIGHTS, default: WEIGHTS.lb.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.WEIGHT_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('weightConverter.name') },
    { label: `${WEIGHTS[from].label} ↔ ${WEIGHTS[to].label}` },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('weightConverter.name'),
          description: t('weightConverter.meta.description'),
          path: ROUTES.WEIGHT_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('unitConverter.name'), url: ROUTES.LENGTH_CONVERTER },
          { name: t('weightConverter.name'), url: ROUTES.WEIGHT_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <WeightConverter from={from} to={to} />
    </PageContainer>
  );
}
