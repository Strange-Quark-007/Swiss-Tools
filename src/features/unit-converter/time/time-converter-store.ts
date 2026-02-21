import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { TimeType } from './utils';

export type TimeConverterState = BaseConverterState<TimeType>;

const partializeSettings = (state: TimeConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useTimeConverterStore = createRoutePersistedStore<TimeConverterState>(
  ROUTES.TIME_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
