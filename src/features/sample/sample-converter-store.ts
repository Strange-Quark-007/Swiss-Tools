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

export const useSampleConverterStore = createRoutePersistedStore(
  ROUTES.CASE_CONVERTER,
  createBaseConverterStore,
  // @ts-expect-error - Type error expected here since this is a scaffold template using a placeholder route
  partializeSettings
);
