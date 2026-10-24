import { ROUTES } from '@/constants/routes';
import { defineExhaustiveSet } from '@/lib/utils';
import { getRouteStore } from '@/store/store-registry';
import { Ingestible } from '@/types/base-state';
import { StoreStates } from '@/types/store';

/**
 * Custom drag data type used by Magic Drop
 * to distinguish panel payloads from plain-text selections.
 */
export const MAGIC_DROP_MIME_TYPE = 'application/x-magic-drop';

/**
 * Routes whose stores implement the `Ingestible` contract.
 */
export type IngestibleRoute = { [R in ROUTES]: StoreStates[R] extends Ingestible ? R : never }[ROUTES];

const exhaustiveSet = defineExhaustiveSet<IngestibleRoute>();
/**
 * Routes that accept Magic Drop payloads.
 *
 * Exhaustively enforced at compile time:
 * every route whose store implements the `Ingestible` contract
 * must be included here.
 */
export const MAGIC_DROP_TARGET_ROUTES = exhaustiveSet([
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
]);

export const isMagicDropTargetRoute = (route: ROUTES): route is IngestibleRoute => MAGIC_DROP_TARGET_ROUTES.has(route);

/**
 * Transfers payload data to a target route's store.
 * Invokes the `ingest` capability declared by the target store.
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

  storeEntry.store.getState().ingest(data);

  return true;
}
