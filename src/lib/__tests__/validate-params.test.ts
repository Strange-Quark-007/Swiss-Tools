import { redirect } from 'next/navigation';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';

import { validateQueryParams } from '../validate-params';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('validateQueryParams', () => {
  const sampleMap = {
    opt1: { value: 'opt1', label: 'Option 1' },
    opt2: { value: 'opt2', label: 'Option 2' },
  };

  const sampleConfig = {
    [SEARCH_PARAM_KEYS.FROM]: {
      map: sampleMap,
      default: 'opt1' as const,
    },
    [SEARCH_PARAM_KEYS.TO]: {
      map: sampleMap,
      default: 'opt2' as const,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return validated params without redirecting when all params are valid', () => {
    const params = {
      [SEARCH_PARAM_KEYS.FROM]: 'opt2',
      [SEARCH_PARAM_KEYS.TO]: 'opt1',
    };

    const result = validateQueryParams(params, sampleConfig, ROUTES.CASE_CONVERTER);

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toEqual({
      [SEARCH_PARAM_KEYS.FROM]: 'opt2',
      [SEARCH_PARAM_KEYS.TO]: 'opt1',
    });
  });

  it('should use first value if param is an array of valid strings', () => {
    const params = {
      [SEARCH_PARAM_KEYS.FROM]: ['opt1', 'opt2'],
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    };

    const result = validateQueryParams(params, sampleConfig, ROUTES.CASE_CONVERTER);

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toEqual({
      [SEARCH_PARAM_KEYS.FROM]: 'opt1',
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    });
  });

  it('should fallback to default and redirect when param is an empty array', () => {
    const params = {
      [SEARCH_PARAM_KEYS.FROM]: [] as string[],
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    };

    const result = validateQueryParams(params, sampleConfig, ROUTES.CASE_CONVERTER);

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.CASE_CONVERTER}?${SEARCH_PARAM_KEYS.FROM}=opt1&${SEARCH_PARAM_KEYS.TO}=opt2`
    );
    expect(result).toEqual({
      [SEARCH_PARAM_KEYS.FROM]: 'opt1',
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    });
  });

  it('should fallback to default and redirect when first element in array is invalid', () => {
    const params = {
      [SEARCH_PARAM_KEYS.FROM]: ['invalid-option', 'opt1'],
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    };

    const result = validateQueryParams(params, sampleConfig, ROUTES.CASE_CONVERTER);

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.CASE_CONVERTER}?${SEARCH_PARAM_KEYS.FROM}=opt1&${SEARCH_PARAM_KEYS.TO}=opt2`
    );
    expect(result).toEqual({
      [SEARCH_PARAM_KEYS.FROM]: 'opt1',
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    });
  });

  it('should redirect to canonical URL when a parameter is missing', () => {
    const params = {
      [SEARCH_PARAM_KEYS.FROM]: 'opt1',
    };

    const result = validateQueryParams(params, sampleConfig, ROUTES.CASE_CONVERTER);

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.CASE_CONVERTER}?${SEARCH_PARAM_KEYS.FROM}=opt1&${SEARCH_PARAM_KEYS.TO}=opt2`
    );
    expect(result).toEqual({
      [SEARCH_PARAM_KEYS.FROM]: 'opt1',
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    });
  });

  it('should fallback to default and redirect when both parameters have invalid value', () => {
    const params = {
      [SEARCH_PARAM_KEYS.FROM]: 'invalid-value',
      [SEARCH_PARAM_KEYS.TO]: 'also-invalid',
    };

    const result = validateQueryParams(params, sampleConfig, ROUTES.NUMBER_CONVERTER);

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.NUMBER_CONVERTER}?${SEARCH_PARAM_KEYS.FROM}=opt1&${SEARCH_PARAM_KEYS.TO}=opt2`
    );
    expect(result).toEqual({
      [SEARCH_PARAM_KEYS.FROM]: 'opt1',
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    });
  });

  it('should retain valid param, fallback invalid param to default, and redirect', () => {
    const params = {
      [SEARCH_PARAM_KEYS.FROM]: 'opt2', // valid non-default (default is 'opt1')
      [SEARCH_PARAM_KEYS.TO]: 'invalid-value', // invalid
    };

    const result = validateQueryParams(params, sampleConfig, ROUTES.CASE_CONVERTER);

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.CASE_CONVERTER}?${SEARCH_PARAM_KEYS.FROM}=opt2&${SEARCH_PARAM_KEYS.TO}=opt2`
    );
    expect(result).toEqual({
      [SEARCH_PARAM_KEYS.FROM]: 'opt2',
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    });
  });

  it('should handle completely empty search params', () => {
    const params = {};

    const result = validateQueryParams(params, sampleConfig, ROUTES.ENCODER_DECODER);

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.ENCODER_DECODER}?${SEARCH_PARAM_KEYS.FROM}=opt1&${SEARCH_PARAM_KEYS.TO}=opt2`
    );
    expect(result).toEqual({
      [SEARCH_PARAM_KEYS.FROM]: 'opt1',
      [SEARCH_PARAM_KEYS.TO]: 'opt2',
    });
  });
});
