import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JwtDecoder } from '@/features/jwt-decoder/jwt-decoder';
import { getT } from '@/i18n/utils';

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('jwtDecoder.meta.title'),
    description: t('jwtDecoder.meta.description'),
  };
}

export default async function JwtDecoderPage() {
  const t = await getT();

  const items = [{ label: t('jwtDecoder.name') }];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <JwtDecoder />
    </PageContainer>
  );
}
