import { Footer } from '@/components/app-layout/app-footer';
import { ROUTES } from '@/constants/routes';
import { Labs } from '@/labs/labs';
import { createPageMetadata } from '@/seo/metadata';

export async function generateMetadata() {
  return createPageMetadata({
    titleKey: 'labs.meta.title',
    descriptionKey: 'labs.meta.description',
    pathname: ROUTES.LABS,
  });
}

export default async function LabsPage() {
  return (
    <>
      <Labs />
      <Footer />
    </>
  );
}
