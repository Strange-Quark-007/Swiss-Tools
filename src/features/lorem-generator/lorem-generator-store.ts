import { ROUTES } from '@/constants/routes';
import { createOutputSlice } from '@/store/slices';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { OutputState, Resettable } from '@/types/base-state';

import { LoremType } from './utils';

export interface LoremGeneratorState extends OutputState, Resettable {
  type?: LoremType;
  count: number;

  setType: (value: LoremType) => void;
  setCount: (value: number) => void;
}

const createLoremGeneratorStore: StoreCreator<LoremGeneratorState> = (set) => ({
  ...createOutputSlice(set),
  count: 10,

  setType: (type) => set({ type }),
  setCount: (count) => set({ count }),
  reset: () => set({ toValue: '', toError: undefined }),
});

const partializeSettings = (state: LoremGeneratorState) => ({
  type: state.type,
  count: state.count,
});

export const useLoremGeneratorStore = createRoutePersistedStore<LoremGeneratorState>(
  ROUTES.LOREM_GENERATOR,
  createLoremGeneratorStore,
  partializeSettings
);
