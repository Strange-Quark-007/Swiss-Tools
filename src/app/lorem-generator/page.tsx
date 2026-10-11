import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JsonLd } from '@/components/seo/json-ld';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { LoremGenerator } from '@/features/lorem-generator/lorem-generator';
import { LOREM } from '@/features/lorem-generator/utils';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/lib/json-ld';
import { createToolMetadata } from '@/lib/metadata';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.LOREM_GENERATOR);
}

export default async function LoremGeneratorPage({ searchParams }: Props) {
  const { t } = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.TYPE]: { map: LOREM, default: LOREM.word.value },
  };

  const { type } = validateQueryParams(params, config, ROUTES.LOREM_GENERATOR);

  const items = [{ label: t('loremGenerator.name') }, { label: LOREM[type].label }];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('loremGenerator.name'),
          description: t('loremGenerator.meta.description'),
          path: ROUTES.LOREM_GENERATOR,
          category: 'DeveloperApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('loremGenerator.name'), url: ROUTES.LOREM_GENERATOR },
        ])}
      />
      <AppBreadcrumb items={items} />
      <LoremGenerator type={type} />
    </PageContainer>
  );
}
