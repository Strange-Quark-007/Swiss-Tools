import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { useAppStore } from '@/store/app-store';

import { resetAppStore } from '../app-store';

describe('resetAppStore', () => {
  it('should restore default values after the store is mutated', () => {
    useAppStore.setState({ navbarTitle: 'Temporary Title' });
    useAppStore.getState().addFavorite(ROUTES.NUMBER_CONVERTER);

    resetAppStore();

    expect(useAppStore.getState().navbarTitle).toBe('');
    expect(useAppStore.getState().favorites).toEqual([]);
  });

  it('should restore action references so later calls keep working', () => {
    const addFavorite = useAppStore.getState().addFavorite;

    resetAppStore();

    expect(useAppStore.getState().addFavorite).toBe(addFavorite);

    useAppStore.getState().addFavorite(ROUTES.HASH_GENERATOR);
    expect(useAppStore.getState().favorites).toEqual([ROUTES.HASH_GENERATOR]);
  });
});
