import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { NumberConverter } from '@/features/number-converter/number-converter';
import { BASES } from '@/features/number-converter/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { SearchParams } from '@/types/common';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('numberConverter.meta.title'),
    description: t('numberConverter.meta.description'),
  };
}

export default async function NumberConverterPage({ searchParams }: Props) {
  const t = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: BASES, default: BASES.decimal.value },
    [SEARCH_PARAM_KEYS.TO]: { map: BASES, default: BASES.binary.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.NUMBER_CONVERTER);

  const items = [{ label: t('numberConverter.name') }, { label: `${BASES[from].label} → ${BASES[to].label}` }];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <NumberConverter from={from} to={to} />
    </PageContainer>
  );
}
