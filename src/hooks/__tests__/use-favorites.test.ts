import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { AppModuleGroupId } from '@/constants/appModules';
import { ROUTES } from '@/constants/routes';
import { useAppStore } from '@/store/store';
import { testT } from '@/test-helpers/i18n';
import { AppModuleGroup } from '@/types/app-module';

import { useFavorites } from '../use-favorites';

vi.mock('@/i18n/utils', () => ({
  useT: () => ({ t: testT }),
}));

describe('useFavorites', () => {
  const mockModules: AppModuleGroup[] = [
    {
      id: AppModuleGroupId.CONVERTERS,
      label: 'Converters',
      items: [
        { id: ROUTES.CASE_CONVERTER, name: 'Case Converter', description: 'Desc 1', icon: (() => null) as never },
        { id: ROUTES.NUMBER_CONVERTER, name: 'Number Converter', description: 'Desc 2', icon: (() => null) as never },
      ],
    },
    {
      id: AppModuleGroupId.SECURITY,
      label: 'Security',
      items: [{ id: ROUTES.HASH_GENERATOR, name: 'Hash Generator', description: 'Desc 3', icon: (() => null) as never }],
    },
  ];

  beforeEach(() => {
    useAppStore.setState({ favorites: [] });
  });

  it('should return empty favorites group when no routes are favored', () => {
    const { result } = renderHook(() => useFavorites(mockModules));

    expect(result.current).toEqual({
      id: AppModuleGroupId.FAVORITES,
      label: testT('label.favorites'),
      items: [],
    });
  });

  it('should filter and return only favored module items', () => {
    useAppStore.setState({ favorites: [ROUTES.CASE_CONVERTER, ROUTES.HASH_GENERATOR] });

    const { result } = renderHook(() => useFavorites(mockModules));

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items.map((item) => item.id)).toEqual([ROUTES.CASE_CONVERTER, ROUTES.HASH_GENERATOR]);
  });

  it('should react dynamically when favorites in store change', () => {
    const { result } = renderHook(() => useFavorites(mockModules));
    expect(result.current.items).toHaveLength(0);

    act(() => {
      useAppStore.getState().addFavorite(ROUTES.NUMBER_CONVERTER);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(ROUTES.NUMBER_CONVERTER);
  });
});
