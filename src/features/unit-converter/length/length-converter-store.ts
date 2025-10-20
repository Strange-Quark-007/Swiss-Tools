import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { LengthType } from './utils';

export interface LengthConverterState {
  auto: boolean;
  from?: LengthType;
  to?: LengthType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: LengthType) => void;
  setTo: (to: LengthType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createLengthConverterStore: StoreCreator<LengthConverterState> = (set) => ({
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

const partializeSettings = (state: LengthConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useLengthConverterStore = createRoutePersistedStore<LengthConverterState>(
  ROUTES.LENGTH_CONVERTER,
  createLengthConverterStore,
  partializeSettings
);
