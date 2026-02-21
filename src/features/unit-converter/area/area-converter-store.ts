import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { AreaType } from './utils';

export type AreaConverterState = BaseConverterState<AreaType>;

const partializeSettings = (state: AreaConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useAreaConverterStore = createRoutePersistedStore<AreaConverterState>(
  ROUTES.AREA_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
