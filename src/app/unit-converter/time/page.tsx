import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { TimeConverter } from '@/features/unit-converter/time/time-converter';
import { TIMES } from '@/features/unit-converter/time/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('timeConverter.meta.title'),
    description: t('timeConverter.meta.description'),
  };
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
      <AppBreadcrumb items={items} />
      <TimeConverter from={from} to={to} />
    </PageContainer>
  );
}
