import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

import { IDType } from './utils';

export interface IdGeneratorState {
  type?: IDType;
  count: number;
  toValue: string;
  toError?: string;

  setType: (value: IDType) => void;
  setCount: (value: number) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createIdGeneratorStore: StoreCreator<IdGeneratorState> = (set) => ({
  toValue: '',
  count: 10,
  toError: undefined,

  setType: (type) => set({ type }),
  setCount: (count) => set({ count }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
  reset: () => set({ toValue: '', toError: undefined }),
});

const partializeSettings = (state: IdGeneratorState) => ({
  type: state.type,
  count: state.count,
});

export const useIdGeneratorStore = createRoutePersistedStore<IdGeneratorState>(
  ROUTES.ID_GENERATOR,
  createIdGeneratorStore,
  partializeSettings
);
