import { renderHook } from '@testing-library/react';
import { StrictMode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';

import { getRouteStore, storeRegistry } from '../store-registry';
import { useRegisterStores } from '../use-register-stores';

describe('useRegisterStores', () => {
  beforeEach(() => {
    Object.keys(storeRegistry).forEach((key) => {
      delete storeRegistry[key as ROUTES];
    });
  });

  it('should register all configured route stores on mount', () => {
    expect(getRouteStore(ROUTES.CASE_CONVERTER)).toBeUndefined();
    expect(getRouteStore(ROUTES.LENGTH_CONVERTER)).toBeUndefined();

    renderHook(() => useRegisterStores());

    // Verify representative registered stores and their query params
    const caseConverter = getRouteStore(ROUTES.CASE_CONVERTER);
    expect(caseConverter).toBeDefined();
    expect(caseConverter?.params).toEqual(['from', 'to']);

    const encoderDecoder = getRouteStore(ROUTES.ENCODER_DECODER);
    expect(encoderDecoder).toBeDefined();
    expect(encoderDecoder?.params).toEqual(['codec', 'mode']);

    const hashGenerator = getRouteStore(ROUTES.HASH_GENERATOR);
    expect(hashGenerator).toBeDefined();
    expect(hashGenerator?.params).toEqual(['algo', 'encoding']);

    const colorPicker = getRouteStore(ROUTES.COLOR_PICKER);
    expect(colorPicker).toBeDefined();
    expect(colorPicker?.params).toEqual([]);

    const regexTester = getRouteStore(ROUTES.REGEX_TESTER);
    expect(regexTester).toBeDefined();
    expect(regexTester?.params).toEqual(['pattern']);

    const lengthConverter = getRouteStore(ROUTES.LENGTH_CONVERTER);
    expect(lengthConverter).toBeDefined();
    expect(lengthConverter?.params).toEqual(['from', 'to']);
  });

  it('should handle StrictMode double invocation without re-registering', () => {
    renderHook(() => useRegisterStores(), { wrapper: StrictMode });

    expect(getRouteStore(ROUTES.CASE_CONVERTER)).toBeDefined();
  });
});
