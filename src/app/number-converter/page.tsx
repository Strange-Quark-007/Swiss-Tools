import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JsonLd } from '@/components/seo/json-ld';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { NumberConverter } from '@/features/number-converter/number-converter';
import { BASES } from '@/features/number-converter/utils';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/lib/json-ld';
import { createToolMetadata } from '@/lib/metadata';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.NUMBER_CONVERTER);
}

export default async function NumberConverterPage({ searchParams }: Props) {
  const { t } = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: BASES, default: BASES.decimal.value },
    [SEARCH_PARAM_KEYS.TO]: { map: BASES, default: BASES.binary.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.NUMBER_CONVERTER);

  const items = [{ label: t('numberConverter.name') }, { label: `${BASES[from].label} ↔ ${BASES[to].label}` }];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('numberConverter.name'),
          description: t('numberConverter.meta.description'),
          path: ROUTES.NUMBER_CONVERTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('numberConverter.name'), url: ROUTES.NUMBER_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <NumberConverter from={from} to={to} />
    </PageContainer>
  );
}
