import { Metadata } from 'next';

import { APP_NAME } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { APP_MANIFEST_ICON_PATH } from '@/constants/seo';
import { getT } from '@/i18n/utils';
import { getRoutePrefix } from '@/lib/utils';

export { getRoutePrefix };

export interface PageMetadataOptions {
  titleKey: string;
  descriptionKey: string;
  pathname?: string;
  keywords?: string[];
}

/**
 * Creates standardized Next.js page metadata including SEO, Open Graph, and Twitter Cards.
 */
export async function createPageMetadata({
  titleKey,
  descriptionKey,
  pathname = '',
  keywords,
}: PageMetadataOptions): Promise<Metadata> {
  const { t } = await getT();

  const title = t(titleKey);
  const description = t(descriptionKey);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title,
      description,
      url: pathname,
      siteName: APP_NAME,
      type: 'website',
      images: [
        {
          url: APP_MANIFEST_ICON_PATH,
          width: 512,
          height: 512,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [APP_MANIFEST_ICON_PATH],
    },
  };
}

/**
 * Convenience helper for tool routes that automatically computes the prefix from the route.
 */
export async function createToolMetadata(route: ROUTES, keywords?: string[]): Promise<Metadata> {
  const prefix = getRoutePrefix(route);

  return createPageMetadata({
    titleKey: `${prefix}.meta.title`,
    descriptionKey: `${prefix}.meta.description`,
    pathname: route,
    keywords,
  });
}
