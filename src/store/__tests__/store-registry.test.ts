import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'zustand';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';

import { getRouteStore, registerRouteStore, storeRegistry } from '../store-registry';

describe('store-registry', () => {
  beforeEach(() => {
    // Clear registry between tests
    Object.keys(storeRegistry).forEach((key) => {
      delete storeRegistry[key as ROUTES];
    });
  });

  it('should return undefined when store is not registered for a route', () => {
    expect(getRouteStore(ROUTES.CASE_CONVERTER)).toBeUndefined();
  });

  it('should register a route store with query params and return the store instance', () => {
    const mockStore = createStore(() => ({ from: 'a', to: 'b' }));
    const params = [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO] as ('from' | 'to')[];

    const returnedStore = registerRouteStore(ROUTES.CASE_CONVERTER, mockStore as never, params as never);

    expect(returnedStore).toBe(mockStore);

    const entry = getRouteStore(ROUTES.CASE_CONVERTER);
    expect(entry).toBeDefined();
    expect(entry?.store).toBe(mockStore);
    expect(entry?.params).toEqual(params);
  });

  it('should default params to an empty array when not provided', () => {
    const mockStore = createStore(() => ({}));

    registerRouteStore(ROUTES.COLOR_PICKER, mockStore as never);

    const entry = getRouteStore(ROUTES.COLOR_PICKER);
    expect(entry).toBeDefined();
    expect(entry?.params).toEqual([]);
  });

  it('should allow overwriting an existing route registration', () => {
    const store1 = createStore(() => ({ version: 1 }));
    const store2 = createStore(() => ({ version: 2 }));

    registerRouteStore(ROUTES.JWT_DECODER, store1 as never);
    expect(getRouteStore(ROUTES.JWT_DECODER)?.store).toBe(store1);

    registerRouteStore(ROUTES.JWT_DECODER, store2 as never);
    expect(getRouteStore(ROUTES.JWT_DECODER)?.store).toBe(store2);
  });
});
