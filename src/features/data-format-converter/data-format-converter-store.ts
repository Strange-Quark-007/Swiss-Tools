import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { DataFormatType, FORMAT_MODES } from './utils';

export interface DataFormatConverterState {
  auto: boolean;
  from?: DataFormatType;
  to?: DataFormatType;
  fromValue: string;
  toValue: string;
  formatMode: FORMAT_MODES;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: DataFormatType) => void;
  setTo: (to: DataFormatType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setFormatMode: (value: FORMAT_MODES) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createDataFormatConverterStore: StoreCreator<DataFormatConverterState> = (set) => ({
  auto: true,
  fromValue: '',
  toValue: '',
  formatMode: FORMAT_MODES.pretty,
  toError: undefined,

  setAuto: (auto) => set({ auto }),
  setFrom: (from) => set({ from }),
  setTo: (to) => set({ to }),
  setFromValue: (fromValue) => set({ fromValue }),
  setToValue: (toValue) => set({ toValue }),
  setFormatMode: (formatMode) => set({ formatMode }),
  setToError: (toError) => set({ toError }),
  reset: () => set({ fromValue: '', toValue: '', formatMode: FORMAT_MODES.pretty, toError: undefined }),
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
