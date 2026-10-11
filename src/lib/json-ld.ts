import { APP_NAME, CREATOR_NAME, CREATOR_URL } from '@/constants/common';
import {
  APPLICATION_CATEGORY,
  APP_MANIFEST_ICON_PATH,
  BROWSER_REQUIREMENTS,
  DEFAULT_TOOL_FEATURES,
  OPERATING_SYSTEM_ALL,
  SCHEMA_CONTEXT,
  SCHEMA_TYPE,
} from '@/constants/seo';

export interface WebsiteJsonLdOptions {
  name?: string;
  description?: string;
}

export interface ToolJsonLdOptions {
  name: string;
  description: string;
  path: string;
  category?: string;
  features?: readonly string[] | string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateWebsiteJsonLd(options?: WebsiteJsonLdOptions) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': SCHEMA_TYPE.WEBSITE,
    name: options?.name || APP_NAME,
    url: baseUrl,
    ...(options?.description && { description: options.description }),
    publisher: {
      '@type': SCHEMA_TYPE.ORGANIZATION,
      name: APP_NAME,
      url: baseUrl,
      logo: `${baseUrl}${APP_MANIFEST_ICON_PATH}`,
    },
  };
}

export function generateToolJsonLd({
  name,
  description,
  path,
  category = APPLICATION_CATEGORY.UTILITIES,
  features = DEFAULT_TOOL_FEATURES,
}: ToolJsonLdOptions) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const url = `${baseUrl}${path}`;

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': SCHEMA_TYPE.WEB_APPLICATION,
    name,
    description,
    url,
    applicationCategory: category,
    operatingSystem: OPERATING_SYSTEM_ALL,
    browserRequirements: BROWSER_REQUIREMENTS,
    isAccessibleForFree: true,
    featureList: [...features],
    creator: {
      '@type': SCHEMA_TYPE.ORGANIZATION,
      name: CREATOR_NAME,
      url: CREATOR_URL,
    },
  };
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': SCHEMA_TYPE.BREADCRUMB_LIST,
    itemListElement: items.map((item, index) => ({
      '@type': SCHEMA_TYPE.LIST_ITEM,
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}
