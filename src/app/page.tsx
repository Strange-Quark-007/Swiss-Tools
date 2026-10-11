import { Footer } from '@/components/app-layout/app-footer';
import { ROUTES } from '@/constants/routes';
import { Landing } from '@/landing/landing';
import { createPageMetadata } from '@/seo/metadata';

export async function generateMetadata() {
  return createPageMetadata({
    titleKey: 'home.meta.title',
    descriptionKey: 'home.meta.description',
    pathname: ROUTES.HOME,
  });
}

export default function Home() {
  return (
    <>
      <Landing />
      <Footer />
    </>
  );
}
