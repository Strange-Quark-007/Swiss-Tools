import { Footer } from '@/components/app-layout/app-footer';
import { ROUTES } from '@/constants/routes';
import { Privacy } from '@/privacy/privacy';
import { createPageMetadata } from '@/seo/metadata';

export async function generateMetadata() {
  return createPageMetadata({
    titleKey: 'privacy.meta.title',
    descriptionKey: 'privacy.meta.description',
    pathname: ROUTES.PRIVACY,
  });
}

export default async function PrivacyPage() {
  return (
    <>
      <Privacy />
      <Footer />
    </>
  );
}
