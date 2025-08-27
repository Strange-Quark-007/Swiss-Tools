import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SEARCH_PARAM_KEYS } from '@/constants/common';

type UrlSearchParams<T> = [T, (newValue: T) => void];

/**
 * Custom hook for managing URL search parameters with type safety
 * @param key - The URL search parameter key
 * @param defaultValue - Default value to use if the parameter is not present
 * @returns Object containing the current value and a function to update it
 */
export function useUrlSearchParams<T extends string>(key: SEARCH_PARAM_KEYS, defaultValue?: T): UrlSearchParams<T> {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paramValue, setParamValue] = useState<T>((searchParams.get(key) || defaultValue || '') as T);

  useEffect(() => {
    const currentValue = (searchParams.get(key) || defaultValue || '') as T;
    setParamValue(currentValue);
  }, [searchParams, key, defaultValue]);

  const setSearchParam = (newValue: T) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (newValue) {
      newParams.set(key, newValue);
    } else {
      newParams.delete(key);
    }

    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  return [paramValue, setSearchParam];
}
