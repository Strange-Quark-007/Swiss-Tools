import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { ColorPicker } from '@/features/color-picker/color-picker';
import { getT } from '@/i18n/utils';

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('colorPicker.meta.title'),
    description: t('colorPicker.meta.description'),
  };
}

export default async function TextCaseConverterPage() {
  const { t } = await getT();

  const items = [{ label: t('colorPicker.name') }];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <ColorPicker />
    </PageContainer>
  );
}
