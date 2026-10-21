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

  setNavbarTitle: (title: string) => void;
  addFavorite: (route: ROUTES) => void;
  removeFavorite: (route: ROUTES) => void;
}

export const createAppStore: StoreCreator<AppState> = (set, get) => ({
  navbarTitle: '',
  favorites: [],

  setNavbarTitle: (navbarTitle) => updateIfChanged({ set, get, key: 'navbarTitle', value: navbarTitle }),
  addFavorite: (route) => {
    const favorites = [...get().favorites, route];
    set({ favorites });
  },
  removeFavorite: (route) => {
    const favorites = get().favorites.filter((id) => id !== route);
    set({ favorites });
  },
});

const partializeSettings = (state: AppState) => ({
  favorites: state.favorites,
});

export const useAppStore = createPersistedStore('appState', createAppStore, partializeSettings);
