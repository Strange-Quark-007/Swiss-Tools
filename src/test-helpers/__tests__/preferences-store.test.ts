import { describe, expect, it } from 'vitest';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { usePreferencesStore } from '@/store/preferences-store';

import { resetPreferencesStore } from '../preferences-store';

describe('resetPreferencesStore', () => {
  it('should restore default values after the store is mutated', () => {
    usePreferencesStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.SESSION });
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);

    resetPreferencesStore();

    expect(usePreferencesStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.STRICT);
    expect(usePreferencesStore.getState().labs.magicDrop).toBe(false);
  });

  it('should restore action references so later calls keep working', () => {
    const setLabsFlag = usePreferencesStore.getState().setLabsFlag;

    resetPreferencesStore();

    expect(usePreferencesStore.getState().setLabsFlag).toBe(setLabsFlag);

    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
    expect(usePreferencesStore.getState().labs.magicDrop).toBe(true);
  });
});
