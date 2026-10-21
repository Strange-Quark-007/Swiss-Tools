import { usePreferencesStore } from '@/store/preferences-store';

// Captured once at module load, before any test mutates the store.
const INITIAL_PREFERENCES_STATE = usePreferencesStore.getState();

/**
 * Restores `usePreferencesStore` to its defaults before each test.
 *
 * `setState(state, true)` replaces the whole state instead of merging, so both
 * values and action references return to the snapshot and no test leaks state
 * or stray keys into the next one.
 */
export const resetPreferencesStore = () => {
  usePreferencesStore.setState(INITIAL_PREFERENCES_STATE, true);
};
