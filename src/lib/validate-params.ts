import { redirect } from 'next/navigation';

import { getFirst } from '@/lib/utils';
import { SearchParams } from '@/types/common';

/**
 * Validates `from` and `to` query parameters against a provided map of allowed keys.
 *
 * - If either parameter is missing or not a key of `map`, this function will
 *   redirect to `route` with `from` and `to` replaced by `defaultValue` (or the
 *   valid counterpart), ensuring a canonical URL shape.
 *
 * @typeParam TMap - The lookup record whose keys enumerate all allowed values.
 * @param params - Raw search params (e.g., from Next.js route segment props).
 * @param map - Record of allowed keys; only its keys are considered valid.
 * @param defaultValue - Fallback key used when a param is invalid or missing.
 * @param route - Destination pathname used for canonicalizing via redirect.
 * @returns The validated `from` and `to` keys.
 *
 * @remarks
 * This function may synchronously interrupt rendering by invoking Next.js `redirect`.
 * When a redirect occurs, it does not return.
 */
export function validateParams<TMap extends Record<string, unknown>>(
  params: SearchParams,
  map: TMap,
  defaultValue: keyof TMap,
  route: string
): { from: keyof TMap; to: keyof TMap } {
  const rawFrom = getFirst(params.from);
  const rawTo = getFirst(params.to);

  const isValidKey = (key: unknown): key is keyof TMap => {
    return typeof key === 'string' && key in map;
  };

  const validFrom = isValidKey(rawFrom) ? (rawFrom as keyof TMap) : defaultValue;
  const validTo = isValidKey(rawTo) ? (rawTo as keyof TMap) : defaultValue;

  if (!isValidKey(rawFrom) || !isValidKey(rawTo)) {
    redirect(`${route}?from=${String(validFrom)}&to=${String(validTo)}`);
  }

  return { from: validFrom, to: validTo };
}
