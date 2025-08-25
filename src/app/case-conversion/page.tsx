import { redirect } from 'next/navigation';

import { CASES } from '@/features/case-conversion/utils';
import { CaseConversion } from '@/features/case-conversion/case-conversion';
import { PageContainer } from '@/components/content-layout/page-container';
import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { SearchParams } from '@/types/common';
import { getFirst } from '@/lib/utils';
import { getT } from '@/i18n/utils';
import { ROUTES } from '@/constants/routes';

interface Props {
  searchParams: Promise<SearchParams>;
}

const validateParams = (params: SearchParams) => {
  const rawFrom = getFirst(params.from);
  const rawTo = getFirst(params.to);

  const isValidCase = (caseType: string | undefined): caseType is keyof typeof CASES => {
    return !!caseType && caseType in CASES;
  };

  const validFrom = isValidCase(rawFrom) ? rawFrom : CASES.lowercase.value;
  const validTo = isValidCase(rawTo) ? rawTo : CASES.uppercase.value;

  if (!isValidCase(rawFrom) || !isValidCase(rawTo)) {
    redirect(`${ROUTES.CASE_CONVERSION}?from=${validFrom}&to=${validTo}`);
  }

  return { from: validFrom, to: validTo };
};

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('caseConversion.meta.title'),
    description: t('caseConversion.meta.description'),
  };
}

export default async function TextCaseConverterPage({ searchParams }: Props) {
  const t = await getT();
  const params = await searchParams;
  const { from, to } = validateParams(params);

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
