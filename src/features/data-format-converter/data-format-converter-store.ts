import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { DataFormatType } from './utils';

export type DataFormatConverterState = BaseConverterState<DataFormatType>;

const partializeSettings = (state: DataFormatConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useDataFormatConverterStore = createRoutePersistedStore<DataFormatConverterState>(
  ROUTES.DATA_FORMAT_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
