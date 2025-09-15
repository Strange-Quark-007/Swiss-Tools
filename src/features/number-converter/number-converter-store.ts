import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { registerRouteStore } from '@/store/store-registry';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { BaseType } from './utils';

export interface NumberConverterState {
  auto: boolean;
  from?: BaseType;
  to?: BaseType;
  fromValue: string;
  toValue: string;
  fromCustomBase: string;
  toCustomBase: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: BaseType) => void;
  setTo: (to: BaseType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  setFromCustomBase: (value: string) => void;
  setToCustomBase: (value: string) => void;
  resetEphemeral: () => void;
  reset: () => void;
}

const createNumberConverterStore: StoreCreator<NumberConverterState> = (set) => ({
  auto: true,
  fromValue: '',
  toValue: '',
  fromCustomBase: '',
  toCustomBase: '',
  toError: undefined,

  setAuto: (auto) => set({ auto }),
  setFrom: (from) => set({ from }),
  setTo: (to) => set({ to }),
  setFromValue: (fromValue) => set({ fromValue }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
  setFromCustomBase: (fromCustomBase) => set({ fromCustomBase }),
  setToCustomBase: (toCustomBase) => set({ toCustomBase }),
  resetEphemeral: () => set({ fromValue: '', toValue: '', toError: undefined }),
  reset: () => set({ fromValue: '', toValue: '', fromCustomBase: '', toCustomBase: '', toError: undefined }),
});

const partializeSettings = (state: NumberConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
  fromCustomBase: state.fromCustomBase,
  toCustomBase: state.toCustomBase,
});

export const useNumberConverterStore = createRoutePersistedStore<NumberConverterState>(
  ROUTES.NUMBER_CONVERTER,
  createNumberConverterStore,
  partializeSettings
);

registerRouteStore(ROUTES.NUMBER_CONVERTER, useNumberConverterStore, [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO]);
