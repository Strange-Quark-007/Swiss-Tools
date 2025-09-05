export type SearchParams = { [key: string]: string | string[] | undefined };

export interface ConverterResult {
  result: string;
  error?: string;
}
