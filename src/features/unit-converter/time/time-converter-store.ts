import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { TimeType } from './utils';

export interface TimeConverterState {
  auto: boolean;
  from?: TimeType;
  to?: TimeType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: TimeType) => void;
  setTo: (to: TimeType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createTimeConverterStore: StoreCreator<TimeConverterState> = (set) => ({
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

const partializeSettings = (state: TimeConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useTimeConverterStore = createRoutePersistedStore<TimeConverterState>(
  ROUTES.TIME_CONVERTER,
  createTimeConverterStore,
  partializeSettings
);
