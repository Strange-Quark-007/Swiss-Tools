import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { IdGenerator } from '@/features/id-generator/id-generator';
import { IDS } from '@/features/id-generator/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { generateBreadcrumbJsonLd, generateToolJsonLd, JsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.ID_GENERATOR);
}

export default async function IdGeneratorPage({ searchParams }: Props) {
  const { t } = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.TYPE]: { map: IDS, default: IDS.uuidv4.value },
  };

  const { type } = validateQueryParams(params, config, ROUTES.ID_GENERATOR);

  const items = [{ label: t('idGenerator.name') }, { label: IDS[type].label }];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('idGenerator.name'),
          description: t('idGenerator.meta.description'),
          path: ROUTES.ID_GENERATOR,
          category: 'DeveloperApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('idGenerator.name'), url: ROUTES.ID_GENERATOR },
        ])}
      />
      <AppBreadcrumb items={items} />
      <IdGenerator type={type} />
    </PageContainer>
  );
}
