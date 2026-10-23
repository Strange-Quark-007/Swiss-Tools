import { Setter } from './slices';

/**
 * Creates a setter that only writes when the value actually changes.
 */
export const createUpdateIfChanged = <T>(set: Setter<T>, get: () => T) => {
  return <K extends keyof T>(key: K, value: T[K]) => {
    if (get()[key] !== value) {
      set((state) => ({ ...state, [key]: value }));
    }
  };
};
