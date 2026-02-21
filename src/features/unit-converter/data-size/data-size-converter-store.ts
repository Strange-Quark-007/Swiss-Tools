import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { DataSizeType } from './utils';

export type DataSizeConverterState = BaseConverterState<DataSizeType>;

const partializeSettings = (state: DataSizeConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useDataSizeConverterStore = createRoutePersistedStore<DataSizeConverterState>(
  ROUTES.DATA_SIZE_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
