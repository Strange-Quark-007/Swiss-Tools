import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { TemperatureType } from './utils';

export type TemperatureConverterState = BaseConverterState<TemperatureType>;

const partializeSettings = (state: TemperatureConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useTemperatureConverterStore = createRoutePersistedStore<TemperatureConverterState>(
  ROUTES.TEMPERATURE_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
