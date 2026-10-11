import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JsonLd } from '@/components/seo/json-ld';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { SpeedConverter } from '@/features/unit-converter/speed/speed-converter';
import { SPEEDS } from '@/features/unit-converter/speed/utils';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/lib/json-ld';
import { createToolMetadata } from '@/lib/metadata';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.SPEED_CONVERTER);
}

export default async function SpeedConverterPage({ searchParams }: Props) {
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
      <JsonLd
        data={generateToolJsonLd({
          name: t('speedConverter.name'),
          description: t('speedConverter.meta.description'),
          path: ROUTES.SPEED_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('unitConverter.name'), url: ROUTES.LENGTH_CONVERTER },
          { name: t('speedConverter.name'), url: ROUTES.SPEED_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <SpeedConverter from={from} to={to} />
    </PageContainer>
  );
}
