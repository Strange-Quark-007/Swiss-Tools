import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { CaseConverter } from '@/features/case-converter/case-converter';
import { CASES } from '@/features/case-converter/utils';
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
    title: t('caseConverter.meta.title'),
    description: t('caseConverter.meta.description'),
  };
}

export default async function TextCaseConverterPage({ searchParams }: Props) {
  const t = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: CASES, default: CASES.lowercase.value },
    [SEARCH_PARAM_KEYS.TO]: { map: CASES, default: CASES.uppercase.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.CASE_CONVERTER);

  const items = [{ label: t('caseConverter.name') }, { label: `${CASES[from].label} → ${CASES[to].label}` }];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <CaseConverter from={from} to={to} />
    </PageContainer>
  );
}
