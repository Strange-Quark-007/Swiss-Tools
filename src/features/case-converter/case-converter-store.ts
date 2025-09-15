import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { registerRouteStore } from '@/store/store-registry';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';

import { CaseType } from './utils';

export interface CaseConverterState {
  auto: boolean;
  from?: CaseType;
  to?: CaseType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFrom: (from: CaseType) => void;
  setTo: (to: CaseType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createCaseConverterStore: StoreCreator<CaseConverterState> = (set) => ({
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

const partializeSettings = (state: CaseConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useCaseConverterStore = createRoutePersistedStore<CaseConverterState>(
  ROUTES.CASE_CONVERTER,
  createCaseConverterStore,
  partializeSettings
);

registerRouteStore(ROUTES.CASE_CONVERTER, useCaseConverterStore, [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO]);
