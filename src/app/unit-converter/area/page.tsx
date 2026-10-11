import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JsonLd } from '@/components/seo/json-ld';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { AreaConverter } from '@/features/unit-converter/area/area-converter';
import { AREAS } from '@/features/unit-converter/area/utils';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/lib/json-ld';
import { createToolMetadata } from '@/lib/metadata';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.AREA_CONVERTER);
}

export default async function AreaConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: AREAS, default: AREAS.sq_m.value },
    [SEARCH_PARAM_KEYS.TO]: { map: AREAS, default: AREAS.sq_ft.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.AREA_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('areaConverter.name') },
    { label: `${AREAS[from].label} ↔ ${AREAS[to].label}` },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('areaConverter.name'),
          description: t('areaConverter.meta.description'),
          path: ROUTES.AREA_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('unitConverter.name'), url: ROUTES.LENGTH_CONVERTER },
          { name: t('areaConverter.name'), url: ROUTES.AREA_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <AreaConverter from={from} to={to} />
    </PageContainer>
  );
}
