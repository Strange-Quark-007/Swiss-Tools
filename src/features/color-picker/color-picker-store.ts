import { Hsl } from 'culori';

import { DEFAULT_HSL_COLOR } from '@/components/ui/shadcn-io/color-picker';
import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

export interface ColorPickerState {
  color: Hsl;
  setColor: (color: Hsl) => void;
}

const createColorPickerStore: StoreCreator<ColorPickerState> = (set) => ({
  color: DEFAULT_HSL_COLOR,
  setColor: (color) => set({ color }),
});

const partializeSettings = () => ({});

export const useColorPickerStore = createRoutePersistedStore<ColorPickerState>(
  ROUTES.COLOR_PICKER,
  createColorPickerStore,
  partializeSettings
);
