import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { SampleType } from './utils';

export interface SampleConverterState {
  auto: boolean;
  from?: SampleType;
  to?: SampleType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: SampleType) => void;
  setTo: (to: SampleType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createSampleConverterStore: StoreCreator<SampleConverterState> = (set) => ({
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

const partializeSettings = (state: SampleConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useSampleConverterStore = createRoutePersistedStore<SampleConverterState>(
  ROUTES.CASE_CONVERTER,
  createSampleConverterStore,
  partializeSettings
);
