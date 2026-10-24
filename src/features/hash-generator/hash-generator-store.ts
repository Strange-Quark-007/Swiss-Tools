import { ROUTES } from '@/constants/routes';
import {
  createAutoSlice,
  createIngestSlice,
  createInputSlice,
  createOutputSlice,
  createResetSlice,
} from '@/store/slices';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { BaseIOState, Ingestible, Resettable } from '@/types/base-state';

import { AlgoType, EncodingType } from './utils';

export interface HashGeneratorState extends BaseIOState, Ingestible, Resettable {
  algo?: AlgoType;
  encoding?: EncodingType;

  setAuto: (auto: boolean) => void;
  setAlgo: (algo: AlgoType) => void;
  setEncoding: (encoding: EncodingType) => void;
}

const createHashGeneratorStore: StoreCreator<HashGeneratorState> = (set) => ({
  ...createAutoSlice(set),
  ...createInputSlice(set),
  ...createOutputSlice(set),
  ...createIngestSlice(set),
  ...createResetSlice(set),

  setAlgo: (algo) => set({ algo }),
  setEncoding: (encoding) => set({ encoding }),
});

const partializeSettings = (state: HashGeneratorState) => ({
  auto: state.auto,
  algo: state.algo,
  encoding: state.encoding,
});

export const useHashGeneratorStore = createRoutePersistedStore(
  ROUTES.HASH_GENERATOR,
  createHashGeneratorStore,
  partializeSettings
);
