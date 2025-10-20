import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { WeightType } from './utils';

export interface WeightConverterState {
  auto: boolean;
  from?: WeightType;
  to?: WeightType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: WeightType) => void;
  setTo: (to: WeightType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createWeightConverterStore: StoreCreator<WeightConverterState> = (set) => ({
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

const partializeSettings = (state: WeightConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useWeightConverterStore = createRoutePersistedStore<WeightConverterState>(
  ROUTES.WEIGHT_CONVERTER,
  createWeightConverterStore,
  partializeSettings
);
