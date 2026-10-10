import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useRegisterStores } from '@/store/use-register-stores';

import { RegisterStores } from '../register-stores';

vi.mock('@/store/use-register-stores', () => ({
  useRegisterStores: vi.fn(),
}));

describe('RegisterStores', () => {
  it('should call useRegisterStores hook and return null', () => {
    const { container } = render(<RegisterStores />);

    expect(useRegisterStores).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });
});
