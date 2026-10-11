import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { ROUTES } from '@/constants/routes';
import { JwtDecoder } from '@/features/jwt-decoder/jwt-decoder';
import { getT } from '@/i18n/utils';
import { JsonLd } from '@/seo/json-ld';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/seo/json-ld';
import { createToolMetadata } from '@/seo/metadata';

export async function generateMetadata() {
  return createToolMetadata(ROUTES.JWT_DECODER);
}

export default async function JwtDecoderPage() {
  const { t } = await getT();

  const items = [{ label: t('jwtDecoder.name') }];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('jwtDecoder.name'),
          description: t('jwtDecoder.meta.description'),
          path: ROUTES.JWT_DECODER,
          category: 'SecurityApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('jwtDecoder.name'), url: ROUTES.JWT_DECODER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <JwtDecoder />
    </PageContainer>
  );
}
