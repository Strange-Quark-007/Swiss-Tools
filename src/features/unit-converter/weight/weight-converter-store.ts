import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { WeightType } from './utils';

export type WeightConverterState = BaseConverterState<WeightType>;

const partializeSettings = (state: WeightConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useWeightConverterStore = createRoutePersistedStore<WeightConverterState>(
  ROUTES.WEIGHT_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
