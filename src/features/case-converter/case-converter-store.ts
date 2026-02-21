import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { CaseType } from './utils';

export type CaseConverterState = BaseConverterState<CaseType>;

const partializeSettings = (state: CaseConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useCaseConverterStore = createRoutePersistedStore<CaseConverterState>(
  ROUTES.CASE_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
