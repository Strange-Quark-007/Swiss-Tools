import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { TemperatureType } from './utils';

export interface TemperatureConverterState {
  auto: boolean;
  from?: TemperatureType;
  to?: TemperatureType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: TemperatureType) => void;
  setTo: (to: TemperatureType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createTemperatureConverterStore: StoreCreator<TemperatureConverterState> = (set) => ({
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

const partializeSettings = (state: TemperatureConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useTemperatureConverterStore = createRoutePersistedStore<TemperatureConverterState>(
  ROUTES.TEMPERATURE_CONVERTER,
  createTemperatureConverterStore,
  partializeSettings
);
