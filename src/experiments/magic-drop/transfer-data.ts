import { ROUTES } from '@/constants/routes';
import { getRouteStore } from '@/store/store-registry';

/**
 * Routes that must not accept Magic Drop payloads.
 * These are either non-tool pages or tools where drop-to-fill is not supported.
 */
export const MAGIC_DROP_DENY_ROUTES: readonly ROUTES[] = [
  ROUTES.HOME,
  ROUTES.DASHBOARD,
  ROUTES.PREFERENCES,
  ROUTES.LABS,
  ROUTES.ID_GENERATOR,
  ROUTES.LOREM_GENERATOR,
  ROUTES.COLOR_PICKER,
];

/**
 * Transfers payload data to a target route's store.
 * Automatically checks and invokes the appropriate input setter
 * (`setFromValue`, `setInput`, or `setTestText`).
 *
 * @param route - Target route identifier
 * @param data - The string payload being transferred
 * @returns boolean indicating whether the target store accepted the payload
 */
export function transferDataToRoute(route: ROUTES, data: string): boolean {
  if (!data || MAGIC_DROP_DENY_ROUTES.includes(route)) {
    return false;
  }

  const storeEntry = getRouteStore(route);
  if (!storeEntry?.store) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state = storeEntry.store.getState() as any;

  if (state.setFromValue) {
    state.setFromValue(data);
    return true;
  }

  if (state.setInput) {
    state.setInput(data);
    return true;
  }

  if (state.setTestText) {
    state.setTestText(data);
    return true;
  }

  return false;
}
