import { CASES } from '@/features/case-conversion/utils';
import { CaseConversion } from '@/features/case-conversion/case-conversion';
import { PageContainer } from '@/components/content-layout/page-container';
import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { SearchParams } from '@/types/common';
import { getT } from '@/i18n/utils';
import { ROUTES } from '@/constants/routes';
import { validateParams } from '@/lib/validate-params';

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
  const { from, to } = validateParams(params, CASES, CASES.lowercase.value, ROUTES.CASE_CONVERSION);

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
