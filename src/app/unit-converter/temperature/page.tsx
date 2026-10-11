import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { TemperatureConverter } from '@/features/unit-converter/temperature/temperature-converter';
import { TEMPERATURES } from '@/features/unit-converter/temperature/utils';
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
  return createToolMetadata(ROUTES.TEMPERATURE_CONVERTER);
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
      <JsonLd
        data={generateToolJsonLd({
          name: t('temperatureConverter.name'),
          description: t('temperatureConverter.meta.description'),
          path: ROUTES.TEMPERATURE_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('unitConverter.name'), url: ROUTES.LENGTH_CONVERTER },
          { name: t('temperatureConverter.name'), url: ROUTES.TEMPERATURE_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <TemperatureConverter from={from} to={to} />
    </PageContainer>
  );
}
