import { DATA_RETENTION_MODE } from '@/constants/common';

import { createPersistedStore, StoreCreator } from './store-factory';
import { createUpdateIfChanged } from './store-utils';

export interface LabsConfig {
  magicDrop: boolean;
}

export const DEFAULT_LABS_CONFIG: LabsConfig = {
  magicDrop: false,
};

interface PreferencesState {
  dataRetentionMode: DATA_RETENTION_MODE;
  labs: LabsConfig;

  setDataRetentionMode: (mode: DATA_RETENTION_MODE) => void;
  setLabsFlag: <K extends keyof LabsConfig>(key: K, value: LabsConfig[K]) => void;
}

export const createPreferencesStore: StoreCreator<PreferencesState> = (set, get) => {
  const updateIfChanged = createUpdateIfChanged(set, get);

  return {
    dataRetentionMode: DATA_RETENTION_MODE.STRICT,
    labs: { ...DEFAULT_LABS_CONFIG },

    setDataRetentionMode: (mode) => updateIfChanged('dataRetentionMode', mode),
    setLabsFlag: <K extends keyof LabsConfig>(key: K, value: LabsConfig[K]) => {
      if (get().labs[key] === value) {
        return;
      }

      set({ labs: { ...get().labs, [key]: value } });
    },
  };
};

const partializeSettings = (state: PreferencesState) => ({
  dataRetentionMode: state.dataRetentionMode,
  labs: state.labs,
});

export const usePreferencesStore = createPersistedStore('preferencesState', createPreferencesStore, partializeSettings);
