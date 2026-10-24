import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { PressureConverter } from '@/features/unit-converter/pressure/pressure-converter';
import { PRESSURES } from '@/features/unit-converter/pressure/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { generateBreadcrumbJsonLd, generateToolJsonLd, JsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.PRESSURE_CONVERTER);
}

export default async function PressureConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: PRESSURES, default: PRESSURES.bar.value },
    [SEARCH_PARAM_KEYS.TO]: { map: PRESSURES, default: PRESSURES.psi.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.PRESSURE_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('pressureConverter.name') },
    { label: `${PRESSURES[from].label} ↔ ${PRESSURES[to].label}` },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('pressureConverter.name'),
          description: t('pressureConverter.meta.description'),
          path: ROUTES.PRESSURE_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('unitConverter.name'), url: ROUTES.LENGTH_CONVERTER },
          { name: t('pressureConverter.name'), url: ROUTES.PRESSURE_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <PressureConverter from={from} to={to} />
    </PageContainer>
  );
}
