import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { SampleType } from './utils';

export type SampleConverterState = BaseConverterState<SampleType>;

const partializeSettings = (state: SampleConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useSampleConverterStore = createRoutePersistedStore<SampleConverterState>(
  ROUTES.CASE_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
