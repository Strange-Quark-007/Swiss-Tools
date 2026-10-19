import { Hsl } from 'culori';

import { DEFAULT_HSL_COLOR } from '@/components/ui/shadcn-io/color-picker';
import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { Resettable } from '@/types/base-state';

export interface ColorPickerState extends Resettable {
  color: Hsl;
  setColor: (color: Hsl) => void;
}

const createColorPickerStore: StoreCreator<ColorPickerState> = (set) => ({
  color: DEFAULT_HSL_COLOR,
  setColor: (color) => set({ color }),
  reset: () => {},
});

const partializeSettings = () => ({});

/**
 * Color picker store managing active HSL color state in memory.
 * Excluded from URL search parameters to preserve smooth gesture interactions.
 *
 * @see Ref: ADR-004 (Exclusion of High-Frequency Color Picker Interactions from URL Query Parameter Synchronization)
 */
export const useColorPickerStore = createRoutePersistedStore(
  ROUTES.COLOR_PICKER,
  createColorPickerStore,
  partializeSettings
);
