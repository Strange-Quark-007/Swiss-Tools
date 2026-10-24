import { ROUTES } from '@/constants/routes';
import { getRouteStore } from '@/store/store-registry';

/**
 * Custom drag data type used by Magic Drop
 * to distinguish panel payloads from plain-text selections.
 */
export const MAGIC_DROP_MIME_TYPE = 'application/x-magic-drop';

/**
 * Routes that accept Magic Drop payloads.
 *
 * Explicit allow list so newly added modules stay inert until they opt in.
 */
export const MAGIC_DROP_TARGET_ROUTES = [
  ROUTES.NUMBER_CONVERTER,
  ROUTES.TIMESTAMP_CONVERTER,
  ROUTES.CASE_CONVERTER,
  ROUTES.DATA_FORMAT_CONVERTER,
  ROUTES.ENCODER_DECODER,
  ROUTES.HASH_GENERATOR,
  ROUTES.JWT_DECODER,
  ROUTES.REGEX_TESTER,
  ROUTES.LENGTH_CONVERTER,
  ROUTES.AREA_CONVERTER,
  ROUTES.VOLUME_CONVERTER,
  ROUTES.WEIGHT_CONVERTER,
  ROUTES.TEMPERATURE_CONVERTER,
  ROUTES.TIME_CONVERTER,
  ROUTES.SPEED_CONVERTER,
  ROUTES.PRESSURE_CONVERTER,
  ROUTES.POWER_CONVERTER,
  ROUTES.DATA_SIZE_CONVERTER,
] as const satisfies readonly ROUTES[];

type MagicDropTargetRoute = (typeof MAGIC_DROP_TARGET_ROUTES)[number];

export const isMagicDropTargetRoute = (route: ROUTES): route is MagicDropTargetRoute =>
  (MAGIC_DROP_TARGET_ROUTES as readonly ROUTES[]).includes(route);

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
  if (!data || !isMagicDropTargetRoute(route)) {
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
