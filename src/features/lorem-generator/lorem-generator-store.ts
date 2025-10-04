import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { LoremType } from './utils';

export interface LoremGeneratorState {
  type?: LoremType;
  count: number;
  toValue: string;
  toError?: string;

  setType: (value: LoremType) => void;
  setCount: (value: number) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createLoremGeneratorStore: StoreCreator<LoremGeneratorState> = (set) => ({
  toValue: '',
  count: 10,
  toError: undefined,

  setType: (type) => set({ type }),
  setCount: (count) => set({ count }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
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
