import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { DataSizeType } from './utils';

export interface DataSizeConverterState {
  auto: boolean;
  from?: DataSizeType;
  to?: DataSizeType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: DataSizeType) => void;
  setTo: (to: DataSizeType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createDataSizeConverterStore: StoreCreator<DataSizeConverterState> = (set) => ({
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

const partializeSettings = (state: DataSizeConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useDataSizeConverterStore = createRoutePersistedStore<DataSizeConverterState>(
  ROUTES.DATA_SIZE_CONVERTER,
  createDataSizeConverterStore,
  partializeSettings
);
