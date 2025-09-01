import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { CaseConversion } from '@/features/case-conversion/case-conversion';
import { CASES } from '@/features/case-conversion/utils';
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
    title: t('caseConversion.meta.title'),
    description: t('caseConversion.meta.description'),
  };
}

export default async function TextCaseConversionPage({ searchParams }: Props) {
  const t = await getT();
  const params = await searchParams;
  const { from, to } = validateQueryParams(
    params,
    {
      [SEARCH_PARAM_KEYS.FROM]: { map: CASES, default: CASES.lowercase.value },
      [SEARCH_PARAM_KEYS.TO]: { map: CASES, default: CASES.uppercase.value },
    },
    ROUTES.CASE_CONVERSION
  );

  const items = [
    { label: t('caseConversion.name'), href: ROUTES.CASE_CONVERSION },
    { label: `${CASES[from].label} → ${CASES[to].label}` },
  ];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <CaseConversion from={from} to={to} />
    </PageContainer>
  );
}
