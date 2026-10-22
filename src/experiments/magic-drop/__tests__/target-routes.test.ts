import { renderHook } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { useRegisterStores } from '@/store/use-register-stores';

import { MAGIC_DROP_TARGET_ROUTES, transferDataToRoute } from '../transfer-data';

describe('Magic Drop target routes', () => {
  beforeAll(() => {
    renderHook(() => useRegisterStores());
  });

  it.each(MAGIC_DROP_TARGET_ROUTES)('transfers a payload into %s', (route) => {
    expect(transferDataToRoute(route, 'payload')).toBe(true);
  });
});
