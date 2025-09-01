import { create } from 'zustand';

import { AppState } from '@/types/store';

export const useAppStore = create<AppState>((set) => ({
  navbarTitle: '',
  setNavbarTitle: (navbarTitle) => set({ navbarTitle }),
}));
