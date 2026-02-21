import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { SpeedType } from './utils';

export type SpeedConverterState = BaseConverterState<SpeedType>;

const partializeSettings = (state: SpeedConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useSpeedConverterStore = createRoutePersistedStore<SpeedConverterState>(
  ROUTES.SPEED_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
