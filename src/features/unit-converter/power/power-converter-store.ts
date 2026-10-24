import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { PowerType } from './utils';

export type PowerConverterState = BaseConverterState<PowerType>;

const partializeSettings = (state: PowerConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const usePowerConverterStore = createRoutePersistedStore(
  ROUTES.POWER_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
