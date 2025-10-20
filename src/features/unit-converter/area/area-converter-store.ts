import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { AreaType } from './utils';

export interface AreaConverterState {
  auto: boolean;
  from?: AreaType;
  to?: AreaType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: AreaType) => void;
  setTo: (to: AreaType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createAreaConverterStore: StoreCreator<AreaConverterState> = (set) => ({
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

const partializeSettings = (state: AreaConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useAreaConverterStore = createRoutePersistedStore<AreaConverterState>(
  ROUTES.AREA_CONVERTER,
  createAreaConverterStore,
  partializeSettings
);
