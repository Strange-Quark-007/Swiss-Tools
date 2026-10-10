import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';

import { useAppStore } from '../store';

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useAppStore.setState({
      navbarTitle: '',
      favorites: [],
    });
  });

  it('should initialize with default empty values', () => {
    const state = useAppStore.getState();

    expect(state.navbarTitle).toBe('');
    expect(state.favorites).toEqual([]);
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

  describe('persistence', () => {
    it('should persist only favorites and omit navbarTitle in localStorage', () => {
      useAppStore.getState().setNavbarTitle('Temporary Header');
      useAppStore.getState().addFavorite(ROUTES.ID_GENERATOR);

      const storedRaw = localStorage.getItem('appState');
      expect(storedRaw).not.toBeNull();

      const parsed = JSON.parse(storedRaw!);
      expect(parsed.state).toEqual({
        favorites: [ROUTES.ID_GENERATOR],
      });
      expect(parsed.state.navbarTitle).toBeUndefined();
    });
  });
});
