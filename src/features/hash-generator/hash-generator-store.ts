import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

interface HashGeneratorState {
  auto: boolean;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
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
  setFromValue: (fromValue) => set({ fromValue }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
  reset: () =>
    set({
      fromValue: '',
      toValue: '',
      toError: undefined,
    }),
});

const partializeSettings = (state: HashGeneratorState) => ({
  auto: state.auto,
});

export const useHashGeneratorStore = createRoutePersistedStore<HashGeneratorState>(
  ROUTES.HASH_GENERATOR,
  createHashGeneratorStore,
  partializeSettings
);
