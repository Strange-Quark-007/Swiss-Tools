import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { SpeedConverter } from '@/features/unit-converter/speed/speed-converter';
import { SPEEDS } from '@/features/unit-converter/speed/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('speedConverter.meta.title'),
    description: t('speedConverter.meta.description'),
  };
}

export default async function AreaConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: SPEEDS, default: SPEEDS.kph.value },
    [SEARCH_PARAM_KEYS.TO]: { map: SPEEDS, default: SPEEDS.mph.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.SPEED_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('speedConverter.name') },
    { label: `${SPEEDS[from].label} ↔ ${SPEEDS[to].label}` },
  ];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <SpeedConverter from={from} to={to} />
    </PageContainer>
  );
}
