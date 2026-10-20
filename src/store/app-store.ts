import { DATA_RETENTION_MODE } from '@/constants/common';
import { ROUTES } from '@/constants/routes';

import { createPersistedStore, StoreCreator } from './store-factory';

interface UpdateIfChanged<K extends keyof AppState> {
  set: (partial: Partial<AppState>) => void;
  get: () => AppState;
  key: K;
  value: AppState[K];
}

const updateIfChanged = <K extends keyof AppState>(args: UpdateIfChanged<K>) => {
  const { set, get, key, value } = args;
  if (get()[key] !== value) {
    set({ [key]: value });
  }
};

interface AppState {
  navbarTitle: string;
  favorites: ROUTES[];
  dataRetentionMode: DATA_RETENTION_MODE;
  magicDrop: boolean;

  setNavbarTitle: (title: string) => void;
  addFavorite: (route: ROUTES) => void;
  removeFavorite: (route: ROUTES) => void;
  setDataRetentionMode: (mode: DATA_RETENTION_MODE) => void;
  setMagicDrop: (enabled: boolean) => void;
}

export const createAppStore: StoreCreator<AppState> = (set, get) => ({
  navbarTitle: '',
  favorites: [],
  dataRetentionMode: DATA_RETENTION_MODE.STRICT,
  magicDrop: false,

  setNavbarTitle: (navbarTitle) => updateIfChanged({ set, get, key: 'navbarTitle', value: navbarTitle }),
  addFavorite: (route) => {
    const favorites = [...get().favorites, route];
    set({ favorites });
  },
  removeFavorite: (route) => {
    const favorites = get().favorites.filter((id) => id !== route);
    set({ favorites });
  },
  setDataRetentionMode: (mode) => updateIfChanged({ set, get, key: 'dataRetentionMode', value: mode }),
  setMagicDrop: (enabled) => updateIfChanged({ set, get, key: 'magicDrop', value: enabled }),
});

const partializeSettings = (state: AppState) => ({
  favorites: state.favorites,
  dataRetentionMode: state.dataRetentionMode,
  magicDrop: state.magicDrop,
});

export const useAppStore = createPersistedStore('appState', createAppStore, partializeSettings);
