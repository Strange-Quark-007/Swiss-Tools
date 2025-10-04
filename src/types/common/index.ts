export type SearchParams = { [key: string]: string | string[] | undefined };

export interface ConverterResult {
  result: string;
  error?: string;
}

export type PropertyUnion<T extends Record<string, unknown>, K extends keyof T[keyof T]> = T[keyof T][K];
export type ValueUnion<T extends Record<string, { value: unknown }>> = PropertyUnion<T, 'value'>;
