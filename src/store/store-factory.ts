import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { ROUTES } from '@/constants/routes';

export type StoreCreator<T> = StateCreator<T, [], [], T>;

export function createRoutePersistedStore<T>(
  route: ROUTES,
  storeCreator: StoreCreator<T>,
  partialize?: (state: T) => Partial<T>
) {
  return createPersistedStore(route.slice(1), storeCreator, partialize);
}

export function createPersistedStore<T>(
  key: string,
  storeCreator: StoreCreator<T>,
  partialize?: (state: T) => Partial<T>
) {
  return create<T>()(
    persist(storeCreator, {
      name: key,
      storage: createJSONStorage(() => localStorage),
      partialize,
    })
  );
}
