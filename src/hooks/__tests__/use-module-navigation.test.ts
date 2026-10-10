import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { createStore } from 'zustand';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { registerRouteStore, storeRegistry } from '@/store/store-registry';

import { useModuleNavigation } from '../use-module-navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('useModuleNavigation', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });

    // Clear registry between tests
    Object.keys(storeRegistry).forEach((key) => {
      delete storeRegistry[key as ROUTES];
    });
  });

  it('should navigate directly to route when no store is registered', () => {
    const { result } = renderHook(() => useModuleNavigation());

    result.current(ROUTES.HOME);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should navigate with query parameters populated from registered store state', () => {
    const mockStore = createStore(() => ({
      from: 'lowercase',
      to: 'uppercase',
    }));

    registerRouteStore(
      ROUTES.CASE_CONVERTER,
      mockStore as never,
      [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO] as never
    );

    const { result } = renderHook(() => useModuleNavigation());

    result.current(ROUTES.CASE_CONVERTER);

    expect(mockPush).toHaveBeenCalledWith('/case-converter?from=lowercase&to=uppercase');
  });

  it('should omit query parameter when store value is undefined', () => {
    const mockStore = createStore(() => ({
      from: 'hex',
      to: undefined,
    }));

    registerRouteStore(
      ROUTES.NUMBER_CONVERTER,
      mockStore as never,
      [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO] as never
    );

    const { result } = renderHook(() => useModuleNavigation());

    result.current(ROUTES.NUMBER_CONVERTER);

    expect(mockPush).toHaveBeenCalledWith('/number-converter?from=hex');
  });

  it('should navigate without query string when registered store has empty params list', () => {
    const mockStore = createStore(() => ({ color: '#fff' }));

    registerRouteStore(ROUTES.COLOR_PICKER, mockStore as never, []);

    const { result } = renderHook(() => useModuleNavigation());

    result.current(ROUTES.COLOR_PICKER);

    expect(mockPush).toHaveBeenCalledWith('/color-picker');
  });
});
