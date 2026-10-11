export const SCHEMA_CONTEXT = 'https://schema.org';

export enum SCHEMA_TYPE {
  WEBSITE = 'WebSite',
  WEB_APPLICATION = 'WebApplication',
  BREADCRUMB_LIST = 'BreadcrumbList',
  LIST_ITEM = 'ListItem',
  ORGANIZATION = 'Organization',
}

export enum APPLICATION_CATEGORY {
  UTILITIES = 'UtilitiesApplication',
}

export const APP_MANIFEST_ICON_PATH = '/web-app-manifest-512x512.png';
export const BROWSER_REQUIREMENTS = 'Requires JavaScript. Requires HTML5.';
export const OPERATING_SYSTEM_ALL = 'All';

export const DEFAULT_APP_KEYWORDS = [
  'developer toolbox',
  'privacy-first developer tools',
  'client-side web utilities',
  'browser-based dev tools',
  'zero tracking developer utilities',
  'unit converter',
  'data format converter',
  'case converter',
  'hash generator',
  'jwt decoder',
  'id generator',
  'color picker',
] as const;

export const DEFAULT_TOOL_FEATURES = [
  '100% client-side execution — zero server transmission',
  'Zero tracking, zero telemetry, privacy-first by architecture',
  'Zero SEO bloat & distraction-free interface',
  'Fast offline computation running entirely in browser',
  'Consistent and predictable UX across all utilities',
] as const;
