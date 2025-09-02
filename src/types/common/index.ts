export type SearchParams = { [key: string]: string | string[] | undefined };

export interface ConversionResult {
  result: string;
  error?: string;
}
