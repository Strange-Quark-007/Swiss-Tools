import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { VOLUMES } from '@/features/unit-converter/volume/utils';
import { VolumeConverter } from '@/features/unit-converter/volume/volume-converter';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('volumeConverter.meta.title'),
    description: t('volumeConverter.meta.description'),
  };
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
      <AppBreadcrumb items={items} />
      <VolumeConverter from={from} to={to} />
    </PageContainer>
  );
}
