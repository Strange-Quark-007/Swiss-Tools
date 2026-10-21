import { useAppStore } from '@/store/app-store';

// Captured once at module load, before any test mutates the store.
const INITIAL_APP_STATE = useAppStore.getState();

/**
 * Restores `useAppStore` to its defaults before each test.
 *
 * `setState(state, true)` replaces the whole state instead of merging, so both
 * values and action references return to the snapshot and no test leaks state
 * or stray keys into the next one. Additional app-level stores get a matching
 * `<name>-store.ts` helper alongside this file, called from `setup.tsx`.
 */
export const resetAppStore = () => {
  useAppStore.setState(INITIAL_APP_STATE, true);
};
