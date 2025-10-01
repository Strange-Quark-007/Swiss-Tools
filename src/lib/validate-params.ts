import { redirect } from 'next/navigation';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { getFirst } from '@/lib/utils';
import { SearchParams } from '@/types/common';

export interface OptionItem {
  value: string;
  label: string;
  [key: string]: unknown;
}

export interface ParamConfig<Map extends Record<string, OptionItem>> {
  map: Map;
  default: keyof Map;
}

export type Config<Map extends Record<string, OptionItem>> = Partial<Record<SEARCH_PARAM_KEYS, ParamConfig<Map>>>;

export type ValidatedParams<Map extends Record<string, OptionItem>, C extends { [K in keyof C]: ParamConfig<Map> }> = {
  [K in keyof C]: C[K]['map'][C[K]['default']]['value'];
};

/**
 * Generic query param validator
 *
 * Validates multiple query parameters against their allowed maps.
 * Redirects to canonical URL if any parameter is missing or invalid.
 *
 * @typeParam Config - The record of parameters to validate.
 * @param params - Raw search params (e.g., from Next.js route segment props).
 * @param config - Record of param configurations. Keys must be from `SEARCH_PARAM_KEYS`.
 * @param route - Pathname to redirect to if any parameter is invalid/missing
 * @returns An object with the same keys as `config` containing validated values.
 *
 * @remarks
 * This function may synchronously interrupt rendering by invoking Next.js `redirect`.
 * When a redirect occurs, it does not return.
 */
export function validateQueryParams<
  Map extends Record<string, OptionItem>,
  C extends { [K in keyof C]: ParamConfig<Map> }
>(params: SearchParams, config: C, route: ROUTES): ValidatedParams<Map, C> {
  const validated = {} as ValidatedParams<Map, C>;
  let needsRedirect = false;

  (Object.keys(config) as Array<keyof C>).forEach((key) => {
    const paramConfig = config[key];
    const { map, default: defaultValue } = paramConfig;

    const rawValue = getFirst(params[key as string]);
    const isValid = typeof rawValue === 'string' && rawValue in map;

    validated[key] = isValid ? rawValue : map[defaultValue]!.value;

    if (!isValid) {
      needsRedirect = true;
    }
  });

  if (needsRedirect) {
    const query = Object.entries(validated)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    redirect(`${route}?${query}`);
  }

  return validated;
}
