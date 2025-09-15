import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { registerRouteStore } from '@/store/store-registry';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';

import { AlgoType, EncodingType } from './utils';

export interface HashGeneratorState {
  auto: boolean;
  algo?: AlgoType;
  encoding?: EncodingType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setAlgo: (algo: AlgoType) => void;
  setEncoding: (encoding: EncodingType) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createHashGeneratorStore: StoreCreator<HashGeneratorState> = (set) => ({
  auto: true,
  fromValue: '',
  toValue: '',
  toError: undefined,

  setAuto: (auto) => set({ auto }),
  setAlgo: (algo) => set({ algo }),
  setEncoding: (encoding) => set({ encoding }),
  setFromValue: (fromValue) => set({ fromValue }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
  reset: () => set({ fromValue: '', toValue: '', toError: undefined }),
});

const partializeSettings = (state: HashGeneratorState) => ({
  auto: state.auto,
  algo: state.algo,
  encoding: state.encoding,
});

export const useHashGeneratorStore = createRoutePersistedStore<HashGeneratorState>(
  ROUTES.HASH_GENERATOR,
  createHashGeneratorStore,
  partializeSettings
);

registerRouteStore(ROUTES.HASH_GENERATOR, useHashGeneratorStore, [SEARCH_PARAM_KEYS.ALGO, SEARCH_PARAM_KEYS.ENCODING]);
