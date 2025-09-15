import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { registerRouteStore } from '@/store/store-registry';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';

import { DataFormatType } from './utils';

export interface DataFormatConverterState {
  auto: boolean;
  from?: DataFormatType;
  to?: DataFormatType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: DataFormatType) => void;
  setTo: (to: DataFormatType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createDataFormatConverterStore: StoreCreator<DataFormatConverterState> = (set) => ({
  auto: true,
  fromValue: '',
  toValue: '',
  toError: undefined,

  setAuto: (auto) => set({ auto }),
  setFrom: (from) => set({ from }),
  setTo: (to) => set({ to }),
  setFromValue: (fromValue) => set({ fromValue }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
  reset: () => set({ fromValue: '', toValue: '', toError: undefined }),
});

const partializeSettings = (state: DataFormatConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useDataFormatConverterStore = createRoutePersistedStore<DataFormatConverterState>(
  ROUTES.DATA_FORMAT_CONVERTER,
  createDataFormatConverterStore,
  partializeSettings
);

registerRouteStore(ROUTES.DATA_FORMAT_CONVERTER, useDataFormatConverterStore, [
  SEARCH_PARAM_KEYS.FROM,
  SEARCH_PARAM_KEYS.TO,
]);
