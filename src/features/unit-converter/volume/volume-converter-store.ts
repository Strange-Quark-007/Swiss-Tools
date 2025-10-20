import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { VolumeType } from './utils';

export interface VolumeConverterState {
  auto: boolean;
  from?: VolumeType;
  to?: VolumeType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: VolumeType) => void;
  setTo: (to: VolumeType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createVolumeConverterStore: StoreCreator<VolumeConverterState> = (set) => ({
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

const partializeSettings = (state: VolumeConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useVolumeConverterStore = createRoutePersistedStore<VolumeConverterState>(
  ROUTES.VOLUME_CONVERTER,
  createVolumeConverterStore,
  partializeSettings
);
