import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { ROUTES } from '@/constants/routes';
import { RegexTester } from '@/features/regex-tester/regex-tester';
import { getT } from '@/i18n/utils';
import { JsonLd } from '@/seo/json-ld';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';

export async function generateMetadata() {
  return createToolMetadata(ROUTES.REGEX_TESTER);
}

export default async function RegexTesterPage() {
  const { t } = await getT();

  const items = [{ label: t('regexTester.name') }];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('regexTester.name'),
          description: t('regexTester.meta.description'),
          path: ROUTES.REGEX_TESTER,
          category: 'UtilitiesApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('regexTester.name'), url: ROUTES.REGEX_TESTER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <RegexTester />
    </PageContainer>
  );
}
