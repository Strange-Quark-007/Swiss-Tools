import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JsonLd } from '@/components/seo/json-ld';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { LengthConverter } from '@/features/unit-converter/length/length-converter';
import { LENGTHS } from '@/features/unit-converter/length/utils';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/lib/json-ld';
import { createToolMetadata } from '@/lib/metadata';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.LENGTH_CONVERTER);
}

export default async function LengthConverterPage({ searchParams }: Props) {
  const { t } = await getT();

  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: LENGTHS, default: LENGTHS.m.value },
    [SEARCH_PARAM_KEYS.TO]: { map: LENGTHS, default: LENGTHS.ft.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.LENGTH_CONVERTER);

  const items = [
    { label: t('unitConverter.name') },
    { label: t('lengthConverter.name') },
    { label: `${LENGTHS[from].label} ↔ ${LENGTHS[to].label}` },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('lengthConverter.name'),
          description: t('lengthConverter.meta.description'),
          path: ROUTES.LENGTH_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('unitConverter.name'), url: ROUTES.LENGTH_CONVERTER },
          { name: t('lengthConverter.name'), url: ROUTES.LENGTH_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <LengthConverter from={from} to={to} />
    </PageContainer>
  );
}
