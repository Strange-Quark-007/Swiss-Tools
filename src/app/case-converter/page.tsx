import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { CaseConverter } from '@/features/case-converter/case-converter';
import { CASES } from '@/features/case-converter/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { generateBreadcrumbJsonLd, generateToolJsonLd, JsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.CASE_CONVERTER);
}

export default async function TextCaseConverterPage({ searchParams }: Props) {
  const { t } = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.FROM]: { map: CASES, default: CASES.lowercase.value },
    [SEARCH_PARAM_KEYS.TO]: { map: CASES, default: CASES.uppercase.value },
  };

  const { from, to } = validateQueryParams(params, config, ROUTES.CASE_CONVERTER);

  const items = [{ label: t('caseConverter.name') }, { label: `${CASES[from].label} ↔ ${CASES[to].label}` }];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('caseConverter.name'),
          description: t('caseConverter.meta.description'),
          path: ROUTES.CASE_CONVERTER,
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('caseConverter.name'), url: ROUTES.CASE_CONVERTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <CaseConverter from={from} to={to} />
    </PageContainer>
  );
}
