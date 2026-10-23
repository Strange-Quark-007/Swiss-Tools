import { Footer } from '@/components/app-layout/app-footer';
import { ROUTES } from '@/constants/routes';
import { Preferences } from '@/preferences/preferences';
import { createPageMetadata } from '@/seo/metadata';

export async function generateMetadata() {
  return createPageMetadata({
    titleKey: 'preferences.meta.title',
    descriptionKey: 'preferences.meta.description',
    pathname: ROUTES.PREFERENCES,
  });
}

export default async function PreferencesPage() {
  return (
    <>
      <Preferences />
      <Footer />
    </>
  );
}
