import type { Hsl } from 'culori';

import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { Resettable } from '@/types/base-state';

/**
 * Default color picker value.
 *
 * Mirrors the default in the shadcn color picker primitive. Importing that
 * module here would pull `culori` into the root bundle through the store
 * registry, so the value is duplicated deliberately.
 */
export const DEFAULT_HSL_COLOR: Hsl = { mode: 'hsl', h: 0, s: 0, l: 1, alpha: 1 };

export interface ColorPickerState extends Resettable {
  color: Hsl;
  setColor: (color: Hsl) => void;
}

const createColorPickerStore: StoreCreator<ColorPickerState> = (set) => ({
  color: DEFAULT_HSL_COLOR,
  setColor: (color) => set({ color }),
  reset: () => set({ color: DEFAULT_HSL_COLOR }),
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
