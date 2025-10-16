import { Footer } from '@/components/app-layout/app-footer';
import { getT } from '@/i18n/utils';
import { Privacy } from '@/privacy/privacy';

export async function generateMetadata() {
  const { t } = await getT();

  return {
    title: t('privacy.meta.title'),
    description: t('privacy.meta.description'),
  };
}

export default async function PrivacyPage() {
  return (
    <>
      <Privacy />
      <Footer />
    </>
  );
}
