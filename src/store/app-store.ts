import { ROUTES } from '@/constants/routes';

import { createPersistedStore, StoreCreator } from './store-factory';
import { createUpdateIfChanged } from './store-utils';

interface AppState {
  navbarTitle: string;
  favorites: ROUTES[];

  setNavbarTitle: (title: string) => void;
  addFavorite: (route: ROUTES) => void;
  removeFavorite: (route: ROUTES) => void;
}

export const createAppStore: StoreCreator<AppState> = (set, get) => {
  const updateIfChanged = createUpdateIfChanged(set, get);

  return {
    navbarTitle: '',
    favorites: [],

    setNavbarTitle: (navbarTitle) => updateIfChanged('navbarTitle', navbarTitle),
    addFavorite: (route) => {
      const favorites = [...get().favorites, route];
      set({ favorites });
    },
    removeFavorite: (route) => {
      const favorites = get().favorites.filter((id) => id !== route);
      set({ favorites });
    },
  };
};

const partializeSettings = (state: AppState) => ({
  favorites: state.favorites,
});

export const useAppStore = createPersistedStore('appState', createAppStore, partializeSettings);
