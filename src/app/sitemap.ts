import { MetadataRoute } from 'next';

import { appModules } from '@/constants/appModules';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';

interface SitemapItem {
  id: ROUTES;
  priority?: MetadataRoute.Sitemap[0]['priority'];
  changeFrequency?: MetadataRoute.Sitemap[0]['changeFrequency'];
}

const staticRoutes: SitemapItem[] = [
  { id: ROUTES.HOME, priority: 1, changeFrequency: 'weekly' },
  { id: ROUTES.DASHBOARD, priority: 0.9, changeFrequency: 'weekly' },
  { id: ROUTES.PRIVACY, priority: 0.6, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { t } = await getT();
  const origin = process.env.NEXT_PUBLIC_BASE_URL;

  const dynamicRoutes: SitemapItem[] = appModules(t)
    .flatMap((group) => group.items)
    .map((item) => ({ id: item.id, priority: 0.8, changeFrequency: 'monthly' }));

  const routes = [...staticRoutes, ...dynamicRoutes];

  return routes.map((route) => ({
    url: `${origin}${route.id}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
