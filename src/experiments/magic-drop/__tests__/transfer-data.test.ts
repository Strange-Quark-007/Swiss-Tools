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
    const ingest = vi.fn();
    const setColor = vi.fn();
    vi.mocked(getRouteStore).mockReturnValue({
      store: {
        getState: () => ({ ingest, setColor }),
      },
    } as never);

    expect(transferDataToRoute(ROUTES.ID_GENERATOR, 'data')).toBe(false);
    expect(transferDataToRoute(ROUTES.LOREM_GENERATOR, 'data')).toBe(false);
    expect(transferDataToRoute(ROUTES.COLOR_PICKER, '#ff0000')).toBe(false);
    expect(transferDataToRoute(ROUTES.PRIVACY, 'data')).toBe(false);
    expect(ingest).not.toHaveBeenCalled();
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

  it.each([ROUTES.DATA_FORMAT_CONVERTER, ROUTES.JWT_DECODER, ROUTES.REGEX_TESTER])(
    'calls ingest on %s target store',
    (targetRoute) => {
      const mockIngest = vi.fn();
      vi.mocked(getRouteStore).mockReturnValue({
        store: {
          getState: () => ({ ingest: mockIngest }),
        },
      } as never);

      const result = transferDataToRoute(targetRoute, 'sample payload');
      expect(result).toBe(true);
      expect(mockIngest).toHaveBeenCalledWith('sample payload');
    }
  );
});
