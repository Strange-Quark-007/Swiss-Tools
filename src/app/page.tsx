import { Footer } from '@/components/app-layout/app-footer';
import { getT } from '@/i18n/utils';
import { Landing } from '@/landing/landing';

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('home.meta.title'),
    description: t('home.meta.description'),
  };
}

export default function Home() {
  return (
    <>
      <Landing />
      <Footer />
    </>
  );
}
