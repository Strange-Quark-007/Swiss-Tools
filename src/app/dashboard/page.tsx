import { Footer } from '@/components/app-layout/app-footer';
import { Dashboard } from '@/dashboard/dashboard';
import { getT } from '@/i18n/utils';

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('dashboard.meta.title'),
    description: t('dashboard.meta.description'),
  };
}

export default async function DashboardPage() {
  return (
    <>
      <Dashboard />
      <Footer />
    </>
  );
}
