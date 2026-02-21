import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { LengthType } from './utils';

export type LengthConverterState = BaseConverterState<LengthType>;

const partializeSettings = (state: LengthConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useLengthConverterStore = createRoutePersistedStore<LengthConverterState>(
  ROUTES.LENGTH_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
