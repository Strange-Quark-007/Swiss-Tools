import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { SpeedType } from './utils';

export interface SpeedConverterState {
  auto: boolean;
  from?: SpeedType;
  to?: SpeedType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: SpeedType) => void;
  setTo: (to: SpeedType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createSpeedConverterStore: StoreCreator<SpeedConverterState> = (set) => ({
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

const partializeSettings = (state: SpeedConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useSpeedConverterStore = createRoutePersistedStore<SpeedConverterState>(
  ROUTES.AREA_CONVERTER,
  createSpeedConverterStore,
  partializeSettings
);
