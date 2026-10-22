import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { resetPreferencesStore } from '@/test-helpers/preferences-store';

import { usePreferencesStore } from '../preferences-store';

describe('usePreferencesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPreferencesStore();
  });

  it('should initialize with STRICT retention and Labs features disabled', () => {
    const state = usePreferencesStore.getState();

    expect(state.dataRetentionMode).toBe(DATA_RETENTION_MODE.STRICT);
    expect(state.labs).toEqual({ magicDrop: false, magicDropStrictNoticeOptOut: false });
  });

  describe('dataRetentionMode management', () => {
    it('should update dataRetentionMode when changed', () => {
      usePreferencesStore.getState().setDataRetentionMode(DATA_RETENTION_MODE.SESSION);
      expect(usePreferencesStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);
    });

    it('should not trigger subscription listener when setting same dataRetentionMode', () => {
      const listener = vi.fn();
      const unsubscribe = usePreferencesStore.subscribe(listener);

      usePreferencesStore.getState().setDataRetentionMode(DATA_RETENTION_MODE.STRICT);
      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('Labs config management', () => {
    it('should update a Labs flag when changed', () => {
      usePreferencesStore.getState().setLabsFlag('magicDrop', true);
      expect(usePreferencesStore.getState().labs.magicDrop).toBe(true);
    });

    it('should persist the strict notice opt-out flag', () => {
      usePreferencesStore.getState().setLabsFlag('magicDropStrictNoticeOptOut', true);
      expect(usePreferencesStore.getState().labs.magicDropStrictNoticeOptOut).toBe(true);
    });

    it('should replace the labs object instead of mutating it', () => {
      const previousLabs = usePreferencesStore.getState().labs;

      usePreferencesStore.getState().setLabsFlag('magicDrop', true);

      expect(usePreferencesStore.getState().labs).not.toBe(previousLabs);
      expect(previousLabs.magicDrop).toBe(false);
    });

    it('should not trigger subscription listener when setting same Labs flag value', () => {
      const listener = vi.fn();
      const unsubscribe = usePreferencesStore.subscribe(listener);

      usePreferencesStore.getState().setLabsFlag('magicDrop', false);
      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('persistence', () => {
    it('should persist dataRetentionMode and Labs config in localStorage', () => {
      usePreferencesStore.getState().setDataRetentionMode(DATA_RETENTION_MODE.SESSION);
      usePreferencesStore.getState().setLabsFlag('magicDrop', true);

      const storedRaw = localStorage.getItem('preferencesState');
      expect(storedRaw).not.toBeNull();

      const parsed = JSON.parse(storedRaw!);
      expect(parsed.state).toEqual({
        dataRetentionMode: DATA_RETENTION_MODE.SESSION,
        labs: { magicDrop: true, magicDropStrictNoticeOptOut: false },
      });
    });
  });
});
