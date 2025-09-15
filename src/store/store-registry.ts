import { StoreApi } from 'zustand';

import { QueryableKeys, StoreEntry, StoreRegistry, StoreStates } from '@/types/store';
import { ROUTES } from '@/constants/routes';

export const storeRegistry: Partial<StoreRegistry> = {};

/**
 * Registers a store for a given route.
 *
 * @template R - The route key from `ROUTES`
 * @param route - The route identifier (must be a `ROUTES` enum value)
 * @param store - The Zustand store instance corresponding to the route
 * @param params - Optional array of `SEARCH_PARAM_KEYS` present in state to sync as query/search parameters.
 *
 * @note Pass only keys whose names match the values of `SEARCH_PARAM_KEYS` and exist in the store state.
 *       TypeScript enforces allowed keys as strings (e.g. `from`),
 *       but always use enum members (e.g., `SEARCH_PARAM_KEYS.FROM`)
 *
 * @returns The registered store instance
 */
export function registerRouteStore<R extends ROUTES>(
  route: R,
  store: StoreApi<StoreStates[R]>,
  params: QueryableKeys<StoreStates[R]>[] = []
): StoreApi<StoreStates[R]> {
  storeRegistry[route] = { store, params } as unknown as StoreRegistry[R];
  return store;
}

/**
 * Retrieves a registered store entry for a given route.
 *
 * @template R - The route key from `ROUTES`
 * @param route - The route to fetch the store for
 * @returns The store entry if registered, otherwise `undefined`
 */
export function getRouteStore<R extends ROUTES>(route: R): StoreEntry<StoreStates[R]> | undefined {
  return storeRegistry[route];
}
