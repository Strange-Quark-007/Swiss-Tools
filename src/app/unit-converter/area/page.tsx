import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { AreaConverter } from '@/features/unit-converter/area/area-converter';
import { AREAS } from '@/features/unit-converter/area/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('areaConverter.meta.title'),
    description: t('areaConverter.meta.description'),
  };
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
      <AppBreadcrumb items={items} />
      <AreaConverter from={from} to={to} />
    </PageContainer>
  );
}
