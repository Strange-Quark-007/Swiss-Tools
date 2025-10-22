export const LOCALE = 'en-US';

export const customScrollbarCss =
  'scrollbar-thin scrollbar-thin-xs scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-muted-foreground scrollbar-track-muted';

export enum SEARCH_PARAM_KEYS {
  FROM = 'from',
  TO = 'to',
  CODEC = 'codec',
  MODE = 'mode',
  ALGO = 'algo',
  ENCODING = 'encoding',
  TYPE = 'type',
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
