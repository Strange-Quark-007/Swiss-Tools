import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { BaseConverterState as BaseState } from '@/types/base-state';
import { StoreStates } from '@/types/store';

import {
  createAutoSlice,
  createFromSlice,
  createToSlice,
  createInputSlice,
  createOutputSlice,
  createResetSlice,
  Setter,
} from './slices';

export type StoreCreator<T> = StateCreator<T, [], [], T>;
export type Partialize<T> = (state: T) => Partial<T>;

export function createRoutePersistedStore<R extends keyof StoreStates>(
  route: R,
  storeCreator: StoreCreator<StoreStates[R]>,
  partialize?: Partialize<StoreStates[R]>
) {
  return createPersistedStore(route.slice(1), storeCreator, partialize);
}

export function createPersistedStore<T>(key: string, storeCreator: StoreCreator<T>, partialize?: Partialize<T>) {
  return create<T>()(
    persist(storeCreator, {
      name: key,
      storage: createJSONStorage(() => localStorage),
      partialize,
    })
  );
}

export const createBaseConverterStore = <U, T extends BaseState<U>>(set: Setter<T>): BaseState<U> => ({
  ...createAutoSlice<T>(set),
  ...createFromSlice<U, T>(set),
  ...createToSlice<U, T>(set),
  ...createInputSlice<T>(set),
  ...createOutputSlice<T>(set),
  ...createResetSlice<T>(set),
});
