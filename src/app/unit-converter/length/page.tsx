import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { getT } from '@/i18n/utils';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('lengthConverter.meta.title'),
    description: t('lengthConverter.meta.description'),
  };
}

export default async function LengthConverterPage({ searchParams: _ }: Props) {
  const { t } = await getT();

  const items = [{ label: t('unitConverter.name') }, { label: t('lengthConverter.name') }];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
    </PageContainer>
  );
}
