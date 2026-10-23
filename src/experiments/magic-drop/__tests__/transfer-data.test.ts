import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { getRouteStore } from '@/store/store-registry';

import { isMagicDropTargetRoute, transferDataToRoute } from '../transfer-data';

vi.mock('@/store/store-registry', () => ({
  getRouteStore: vi.fn(),
}));

describe('transferDataToRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false for null or undefined data', () => {
    // @ts-expect-error testing null
    expect(transferDataToRoute(ROUTES.DATA_FORMAT_CONVERTER, null)).toBe(false);
    // @ts-expect-error testing undefined
    expect(transferDataToRoute(ROUTES.DATA_FORMAT_CONVERTER, undefined)).toBe(false);
  });

  it('returns false for routes that cannot accept input', () => {
    const setFromValue = vi.fn();
    const setColor = vi.fn();
    vi.mocked(getRouteStore).mockReturnValue({
      store: {
        getState: () => ({ setFromValue, setColor }),
      },
    } as never);

    expect(transferDataToRoute(ROUTES.ID_GENERATOR, 'data')).toBe(false);
    expect(transferDataToRoute(ROUTES.LOREM_GENERATOR, 'data')).toBe(false);
    expect(transferDataToRoute(ROUTES.COLOR_PICKER, '#ff0000')).toBe(false);
    expect(transferDataToRoute(ROUTES.PRIVACY, 'data')).toBe(false);
    expect(setFromValue).not.toHaveBeenCalled();
    expect(setColor).not.toHaveBeenCalled();
  });

  it('only treats explicitly allow-listed routes as drop targets', () => {
    expect(isMagicDropTargetRoute(ROUTES.DATA_FORMAT_CONVERTER)).toBe(true);
    expect(isMagicDropTargetRoute(ROUTES.NUMBER_CONVERTER)).toBe(true);
    expect(isMagicDropTargetRoute(ROUTES.HOME)).toBe(false);
    expect(isMagicDropTargetRoute(ROUTES.DASHBOARD)).toBe(false);
    expect(isMagicDropTargetRoute(ROUTES.PRIVACY)).toBe(false);
    expect(isMagicDropTargetRoute(ROUTES.ID_GENERATOR)).toBe(false);
  });

  it('returns false if target store is not found', () => {
    vi.mocked(getRouteStore).mockReturnValue(undefined);
    expect(transferDataToRoute(ROUTES.DATA_FORMAT_CONVERTER, '{"key": "value"}')).toBe(false);
  });

  it('calls setFromValue when available on target store', () => {
    const mockSetFromValue = vi.fn();
    vi.mocked(getRouteStore).mockReturnValue({
      store: {
        getState: () => ({ setFromValue: mockSetFromValue }),
      },
    } as never);

    const result = transferDataToRoute(ROUTES.DATA_FORMAT_CONVERTER, '{"hello": "world"}');
    expect(result).toBe(true);
    expect(mockSetFromValue).toHaveBeenCalledWith('{"hello": "world"}');
  });

  it('calls setInput when available on target store', () => {
    const mockSetInput = vi.fn();
    vi.mocked(getRouteStore).mockReturnValue({
      store: {
        getState: () => ({ setInput: mockSetInput }),
      },
    } as never);

    const result = transferDataToRoute(ROUTES.JWT_DECODER, 'jwt-token-string');
    expect(result).toBe(true);
    expect(mockSetInput).toHaveBeenCalledWith('jwt-token-string');
  });

  it('calls setTestText when available on target store', () => {
    const mockSetTestText = vi.fn();
    vi.mocked(getRouteStore).mockReturnValue({
      store: {
        getState: () => ({ setTestText: mockSetTestText }),
      },
    } as never);

    const result = transferDataToRoute(ROUTES.REGEX_TESTER, 'test sample text');
    expect(result).toBe(true);
    expect(mockSetTestText).toHaveBeenCalledWith('test sample text');
  });

  it('returns false when store has no compatible setter', () => {
    vi.mocked(getRouteStore).mockReturnValue({
      store: {
        getState: () => ({}),
      },
    } as never);

    const result = transferDataToRoute(ROUTES.DATA_FORMAT_CONVERTER, '{"key": "value"}');
    expect(result).toBe(false);
  });
});
