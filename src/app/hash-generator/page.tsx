import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { HashGenerator } from '@/features/hash-generator/hash-generator';
import { HASH_ENCODINGS, HASHING_ALGOS } from '@/features/hash-generator/utils';
import { getT } from '@/i18n/utils';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('hashGenerator.meta.title'),
    description: t('hashGenerator.meta.description'),
  };
}

export default async function HashGeneratorPage({ searchParams }: Props) {
  const t = await getT();
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
      <AppBreadcrumb items={items} />
      <HashGenerator algo={algo} encoding={encoding} />
    </PageContainer>
  );
}
