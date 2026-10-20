import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { ROUTES } from '@/constants/routes';

import { useAppStore } from '../app-store';

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useAppStore.setState({
      navbarTitle: '',
      favorites: [],
      dataRetentionMode: DATA_RETENTION_MODE.STRICT,
      magicDrop: false,
    });
  });

  it('should initialize with default empty values, STRICT dataRetentionMode, and disabled magicDrop', () => {
    const state = useAppStore.getState();

    expect(state.navbarTitle).toBe('');
    expect(state.favorites).toEqual([]);
    expect(state.dataRetentionMode).toBe(DATA_RETENTION_MODE.STRICT);
    expect(state.magicDrop).toBe(false);
  });

  describe('setNavbarTitle', () => {
    it('should update navbar title when value changes', () => {
      useAppStore.getState().setNavbarTitle('Length Converter');
      expect(useAppStore.getState().navbarTitle).toBe('Length Converter');
    });

    it('should not update state when title is unchanged (updateIfChanged)', () => {
      useAppStore.getState().setNavbarTitle('Same Title');

      const listener = vi.fn();
      const unsubscribe = useAppStore.subscribe(listener);

      // Setting same title again should not trigger subscription listener
      useAppStore.getState().setNavbarTitle('Same Title');
      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('favorites management', () => {
    it('should add route to favorites', () => {
      useAppStore.getState().addFavorite(ROUTES.CASE_CONVERTER);
      expect(useAppStore.getState().favorites).toEqual([ROUTES.CASE_CONVERTER]);

      useAppStore.getState().addFavorite(ROUTES.HASH_GENERATOR);
      expect(useAppStore.getState().favorites).toEqual([ROUTES.CASE_CONVERTER, ROUTES.HASH_GENERATOR]);
    });

    it('should remove route from favorites', () => {
      useAppStore.setState({
        favorites: [ROUTES.CASE_CONVERTER, ROUTES.HASH_GENERATOR, ROUTES.COLOR_PICKER],
      });

      useAppStore.getState().removeFavorite(ROUTES.HASH_GENERATOR);
      expect(useAppStore.getState().favorites).toEqual([ROUTES.CASE_CONVERTER, ROUTES.COLOR_PICKER]);
    });
  });

  describe('dataRetentionMode management', () => {
    it('should update dataRetentionMode when changed', () => {
      useAppStore.getState().setDataRetentionMode(DATA_RETENTION_MODE.SESSION);
      expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);
    });

    it('should not trigger subscription listener when setting same dataRetentionMode', () => {
      const listener = vi.fn();
      const unsubscribe = useAppStore.subscribe(listener);

      useAppStore.getState().setDataRetentionMode(DATA_RETENTION_MODE.STRICT);
      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('magicDrop management', () => {
    it('should update magicDrop when changed', () => {
      useAppStore.getState().setMagicDrop(true);
      expect(useAppStore.getState().magicDrop).toBe(true);
    });

    it('should not trigger subscription listener when setting same magicDrop value', () => {
      const listener = vi.fn();
      const unsubscribe = useAppStore.subscribe(listener);

      useAppStore.getState().setMagicDrop(false);
      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('persistence', () => {
    it('should persist favorites, dataRetentionMode, and magicDrop, and omit navbarTitle in localStorage', () => {
      useAppStore.getState().setNavbarTitle('Temporary Header');
      useAppStore.getState().addFavorite(ROUTES.ID_GENERATOR);
      useAppStore.getState().setDataRetentionMode(DATA_RETENTION_MODE.SESSION);
      useAppStore.getState().setMagicDrop(true);

      const storedRaw = localStorage.getItem('appState');
      expect(storedRaw).not.toBeNull();

      const parsed = JSON.parse(storedRaw!);
      expect(parsed.state).toEqual({
        favorites: [ROUTES.ID_GENERATOR],
        dataRetentionMode: DATA_RETENTION_MODE.SESSION,
        magicDrop: true,
      });
      expect(parsed.state.navbarTitle).toBeUndefined();
    });
  });
});
