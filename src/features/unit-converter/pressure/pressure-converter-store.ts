import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { PressureType } from './utils';

export type PressureConverterState = BaseConverterState<PressureType>;

const partializeSettings = (state: PressureConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const usePressureConverterStore = createRoutePersistedStore(
  ROUTES.PRESSURE_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
