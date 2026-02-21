import { ROUTES } from '@/constants/routes';
import { createOutputSlice } from '@/store/slices';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { OutputState, Resettable } from '@/types/base-state';

import { IDType } from './utils';

export interface IdGeneratorState extends OutputState, Resettable {
  type?: IDType;
  count: number;

  setType: (value: IDType) => void;
  setCount: (value: number) => void;
}

const createIdGeneratorStore: StoreCreator<IdGeneratorState> = (set) => ({
  ...createOutputSlice(set),
  count: 10,

  setType: (type) => set({ type }),
  setCount: (count) => set({ count }),
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
