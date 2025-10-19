import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { TemperatureConverter } from '@/features/temperature-converter/temperature-converter';
import { TEMPERATURES } from '@/features/temperature-converter/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('temperatureConverter.meta.title'),
    description: t('temperatureConverter.meta.description'),
  };
}

export default async function TemperatureConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: TEMPERATURES, default: TEMPERATURES.c.value },
    [SEARCH_PARAM_KEYS.TO]: { map: TEMPERATURES, default: TEMPERATURES.f.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.TEMPERATURE_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('temperatureConverter.name') },
    { label: `${TEMPERATURES[from].label} ↔ ${TEMPERATURES[to].label}` },
  ];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <TemperatureConverter from={from} to={to} />
    </PageContainer>
  );
}
