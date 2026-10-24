import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { ROUTES } from '@/constants/routes';
import { ColorPicker } from '@/features/color-picker/color-picker';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd, JsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';

export async function generateMetadata() {
  return createToolMetadata(ROUTES.COLOR_PICKER);
}

export default async function ColorPickerPage() {
  const { t } = await getT();

  const items = [{ label: t('colorPicker.name') }];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('colorPicker.name'),
          description: t('colorPicker.meta.description'),
          path: ROUTES.COLOR_PICKER,
          category: 'DesignApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('colorPicker.name'), url: ROUTES.COLOR_PICKER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <ColorPicker />
    </PageContainer>
  );
}
