import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { getRouteStore } from '@/store/store-registry';

/**
 * Hook to navigate to a module route, automatically syncing state keys to query parameters.
 *
 * This hook abstracts the logic for constructing a URL with query params defined during registration
 * and reads values from the module store dynamically.
 *
 * @param route {ROUTES} - The module route to navigate to (must be a `ROUTES` enum value)
 */
export const useModuleNavigation = () => {
  const router = useRouter();

  const navigate = (route: ROUTES) => {
    const storeEntry = getRouteStore(route);
    const queryParams: Record<string, string> = {};

    if (storeEntry?.store && storeEntry?.params) {
      storeEntry.params.forEach((key) => {
        const value = storeEntry.store.getState()?.[key];
        if (value !== undefined) {
          queryParams[key] = String(value);
        }
      });
    }

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`${route}${queryString ? `?${queryString}` : ''}`);
  };

  return navigate;
};
