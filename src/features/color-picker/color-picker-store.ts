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

/**
 * Upper bound on saved swatches so persisted settings stay small.
 */
export const MAX_SWATCHES = 24;

export interface ColorPickerState extends Resettable {
  color: Hsl;
  swatches: string[];
  editingSwatch: string | null;
  selectedSwatch: string | null;
  setColor: (color: Hsl) => void;
  saveSwatch: (value: string) => void;
  updateSwatch: (oldValue: string, newValue: string) => void;
  removeSwatch: (value: string) => void;
  clearSwatches: () => void;
  setEditingSwatch: (value: string | null) => void;
  setSelectedSwatch: (value: string | null) => void;
}

const createColorPickerStore: StoreCreator<ColorPickerState> = (set) => ({
  color: DEFAULT_HSL_COLOR,
  swatches: [],
  editingSwatch: null,
  selectedSwatch: null,
  setColor: (color) =>
    set((state) => ({
      color,
      selectedSwatch: state.editingSwatch ? state.selectedSwatch : null,
    })),
  saveSwatch: (value) =>
    set((state) => {
      const filtered = state.swatches.filter((swatch) => swatch !== value);
      if (filtered.length === state.swatches.length && state.swatches.length >= MAX_SWATCHES) {
        return state;
      }
      return {
        swatches: [value, ...filtered],
      };
    }),
  updateSwatch: (oldValue, newValue) =>
    set((state) => ({
      swatches: Array.from(new Set(state.swatches.map((swatch) => (swatch === oldValue ? newValue : swatch)))),
      editingSwatch: state.editingSwatch === oldValue ? null : state.editingSwatch,
      selectedSwatch: state.selectedSwatch === oldValue ? newValue : state.selectedSwatch,
    })),
  removeSwatch: (value) =>
    set((state) => ({
      swatches: state.swatches.filter((swatch) => swatch !== value),
      editingSwatch: state.editingSwatch === value ? null : state.editingSwatch,
      selectedSwatch: state.selectedSwatch === value ? null : state.selectedSwatch,
    })),
  clearSwatches: () => set({ swatches: [], editingSwatch: null, selectedSwatch: null }),
  setEditingSwatch: (value) => set({ editingSwatch: value }),
  setSelectedSwatch: (value) => set({ selectedSwatch: value }),
  reset: () => set({ color: DEFAULT_HSL_COLOR, editingSwatch: null, selectedSwatch: null }),
});

const partializeSettings = (state: ColorPickerState) => ({ swatches: state.swatches });

/**
 * Color picker store managing active HSL color state in memory and saved swatches in settings.
 * Excluded from URL search parameters to preserve smooth gesture interactions.
 *
 * @see Ref: ADR-001 (Whitelist-based LocalStorage Persistence for Privacy)
 * @see Ref: ADR-004 (Exclusion of High-Frequency Color Picker Interactions from URL Query Parameter Synchronization)
 */
export const useColorPickerStore = createRoutePersistedStore(
  ROUTES.COLOR_PICKER,
  createColorPickerStore,
  partializeSettings
);
