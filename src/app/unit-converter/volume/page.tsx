import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JsonLd } from '@/components/seo/json-ld';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { VOLUMES } from '@/features/unit-converter/volume/utils';
import { VolumeConverter } from '@/features/unit-converter/volume/volume-converter';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/lib/json-ld';
import { createToolMetadata } from '@/lib/metadata';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.VOLUME_CONVERTER);
}

export default async function VolumeConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: VOLUMES, default: VOLUMES.l.value },
    [SEARCH_PARAM_KEYS.TO]: { map: VOLUMES, default: VOLUMES.gal.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.VOLUME_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('volumeConverter.name') },
    { label: `${VOLUMES[from].label} ↔ ${VOLUMES[to].label}` },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('volumeConverter.name'),
          description: t('volumeConverter.meta.description'),
          path: ROUTES.VOLUME_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('unitConverter.name'), url: ROUTES.LENGTH_CONVERTER },
          { name: t('volumeConverter.name'), url: ROUTES.VOLUME_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <VolumeConverter from={from} to={to} />
    </PageContainer>
  );
}
