import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { TimestampFormatType } from './utils';

export type TimestampConverterState = BaseConverterState<TimestampFormatType>;

const partializeSettings = (state: TimestampConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useTimestampConverterStore = createRoutePersistedStore(
  ROUTES.TIMESTAMP_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
