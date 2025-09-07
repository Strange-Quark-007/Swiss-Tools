import { useRouter, useSearchParams } from 'next/navigation';

import { SEARCH_PARAM_KEYS } from '@/constants/common';

type UrlSearchParams<T> = [T, (newValue: T) => void];

/**
 * Custom hook for managing URL search parameters with type safety
 * @param key - The URL search parameter key
 * @param defaultValue - Default value to use if the parameter is not present
 * @returns Tuple containing [value, setter]
 */
export function useUrlSearchParams<T extends string>(key: SEARCH_PARAM_KEYS, defaultValue?: T): UrlSearchParams<T> {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramValue = (searchParams.get(key) || defaultValue || '') as T;

  const setParamValue = (newValue: T) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set(key, newValue);
    } else {
      params.delete(key);
    }
    router.replace(`?${params}`, { scroll: false });
  };

  return [paramValue, setParamValue];
}

/**
 * Hook to batch update multiple URL search parameters at once.
 * @returns Function to update multiple URL params
 */
export const useBatchUrlSearchParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const batchSetSearchParams = (updates: Partial<Record<SEARCH_PARAM_KEYS, string | null>>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([updateKey, value]) => {
      if (value) {
        newParams.set(updateKey, value);
      } else {
        newParams.delete(updateKey);
      }
    });

    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  return batchSetSearchParams;
};
