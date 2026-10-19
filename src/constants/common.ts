export const LOCALE = 'en-US';

export const APP_NAME = 'Swiss Tools';
export const CREATOR_NAME = 'Strange Quark';
export const CREATOR_URL = 'https://github.com/Strange-Quark-007';
export const GITHUB_URL = 'https://github.com/Strange-Quark-007/Swiss-Tools';

export const customScrollbarCss = 'scrollbar-custom scrollbar-gutter-stable scroll-smooth';

export enum SEARCH_PARAM_KEYS {
  FROM = 'from',
  TO = 'to',
  CODEC = 'codec',
  MODE = 'mode',
  ALGO = 'algo',
  ENCODING = 'encoding',
  TYPE = 'type',
  PATTERN = 'pattern',
}

export enum TOOLTIP_TYPE {
  info = 'info',
  warning = 'warning',
  error = 'error',
}

export enum MIME_TYPE {
  TEXT = 'text/plain',
  JSON = 'application/json',
  XML = 'application/xml',
  YAML = 'application/x-yaml',
  TOML = 'application/toml',
  CSV = 'text/csv',
}

export enum DATA_RETENTION_MODE {
  STRICT = 'strict',
  SESSION = 'session',
}
