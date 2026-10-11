import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { HashGenerator } from '@/features/hash-generator/hash-generator';
import { HASH_ENCODINGS, HASHING_ALGOS } from '@/features/hash-generator/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { JsonLd } from '@/seo/json-ld';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.HASH_GENERATOR);
}

export default async function HashGeneratorPage({ searchParams }: Props) {
  const { t } = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.ALGO]: { map: HASHING_ALGOS, default: HASHING_ALGOS.sha256.value },
    [SEARCH_PARAM_KEYS.ENCODING]: { map: HASH_ENCODINGS, default: HASH_ENCODINGS.hex.value },
  };

  const { algo, encoding } = validateQueryParams(params, config, ROUTES.HASH_GENERATOR);

  const items = [
    { label: t('hashGenerator.name') },
    { label: `${HASHING_ALGOS[algo].label} (${HASH_ENCODINGS[encoding].label})` },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('hashGenerator.name'),
          description: t('hashGenerator.meta.description'),
          path: ROUTES.HASH_GENERATOR,
          category: 'SecurityApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('hashGenerator.name'), url: ROUTES.HASH_GENERATOR },
        ])}
      />
      <AppBreadcrumb items={items} />
      <HashGenerator algo={algo} encoding={encoding} />
    </PageContainer>
  );
}
