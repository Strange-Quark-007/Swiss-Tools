import { create } from 'zustand';

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
  setNavbarTitle: (title: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  navbarTitle: '',
  setNavbarTitle: (navbarTitle) => updateIfChanged({ set, get, key: 'navbarTitle', value: navbarTitle }),
}));
