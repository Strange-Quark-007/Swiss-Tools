import { Footer } from '@/components/app-layout/app-footer';
import { ROUTES } from '@/constants/routes';
import { Dashboard } from '@/dashboard/dashboard';
import { createPageMetadata } from '@/seo/metadata';

export async function generateMetadata() {
  return createPageMetadata({
    titleKey: 'dashboard.meta.title',
    descriptionKey: 'dashboard.meta.description',
    pathname: ROUTES.DASHBOARD,
  });
}

export default async function DashboardPage() {
  return (
    <>
      <Dashboard />
      <Footer />
    </>
  );
}
