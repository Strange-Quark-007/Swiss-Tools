import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { ROUTES } from '@/constants/routes';

export type StoreCreator<T> = StateCreator<T, [], [], T>;

export function createRoutePersistedStore<T>(
  route: ROUTES,
  storeCreator: StoreCreator<T>,
  partialize?: (state: T) => Partial<T>
) {
  return create<T>()(
    persist(storeCreator, {
      name: route.slice(1),
      storage: createJSONStorage(() => localStorage),
      partialize,
    })
  );
}
