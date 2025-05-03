import { create } from 'zustand';

type AppState = {
  navbarTitle: string;
  setNavbarTitle: (title: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  navbarTitle: '',
  setNavbarTitle: (navbarTitle) => set({ navbarTitle }),
}));
