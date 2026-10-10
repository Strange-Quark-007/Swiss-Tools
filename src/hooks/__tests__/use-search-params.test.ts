import { renderHook } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { useBatchUrlSearchParams, useUrlSearchParams } from '../use-search-params';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('use-search-params', () => {
  const mockReplace = vi.fn();
  const mockUseRouter = useRouter as Mock;
  const mockUseSearchParams = useSearchParams as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    mockUseSearchParams.mockReturnValue(new URLSearchParams('from=hex&to=bin'));
  });

  describe('useUrlSearchParams', () => {
    it('should read existing parameter value from URL search params', () => {
      const { result } = renderHook(() => useUrlSearchParams(SEARCH_PARAM_KEYS.FROM));

      expect(result.current[0]).toBe('hex');
    });

    it('should fall back to defaultValue when parameter is not present in URL', () => {
      const { result } = renderHook(() => useUrlSearchParams(SEARCH_PARAM_KEYS.MODE, 'decode'));

      expect(result.current[0]).toBe('decode');
    });

    it('should fall back to empty string when neither param nor defaultValue is present', () => {
      const { result } = renderHook(() => useUrlSearchParams(SEARCH_PARAM_KEYS.ALGO));

      expect(result.current[0]).toBe('');
    });

    it('should update parameter and call router.replace when setting a valid value', () => {
      const { result } = renderHook(() => useUrlSearchParams(SEARCH_PARAM_KEYS.FROM));

      result.current[1]('octal');

      expect(mockReplace).toHaveBeenCalledWith('?from=octal&to=bin', { scroll: false });
    });

    it('should delete parameter from URL when setting an empty value', () => {
      const { result } = renderHook(() => useUrlSearchParams(SEARCH_PARAM_KEYS.FROM));

      result.current[1]('');

      expect(mockReplace).toHaveBeenCalledWith('?to=bin', { scroll: false });
    });
  });

  describe('useBatchUrlSearchParams', () => {
    it('should batch update multiple search parameters and delete falsy/null values', () => {
      const { result } = renderHook(() => useBatchUrlSearchParams());

      result.current({
        [SEARCH_PARAM_KEYS.FROM]: 'base64',
        [SEARCH_PARAM_KEYS.TO]: null,
        [SEARCH_PARAM_KEYS.MODE]: 'encode',
      });

      expect(mockReplace).toHaveBeenCalledWith('?from=base64&mode=encode', { scroll: false });
    });
  });
});
