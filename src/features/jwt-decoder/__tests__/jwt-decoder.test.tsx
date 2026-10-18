import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { JwtDecoder } from '../jwt-decoder';
import { useJwtDecoderStore } from '../jwt-decoder-store';

describe('JwtDecoder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useJwtDecoderStore.getState().reset();
  });

  it('should render input, actions, and output panels', () => {
    render(<JwtDecoder />);

    expect(screen.getByPlaceholderText(testT('jwtDecoder.input.placeholder'))).toBeDefined();
    expect(screen.getByRole('button', { name: testT('label.convert') })).toBeDefined();
    expect(screen.getByPlaceholderText(testT('jwtDecoder.header.placeholder'))).toBeDefined();
  });

  it('should convert input JWT and update store with decoded header and payload', async () => {
    const validJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    useJwtDecoderStore.setState({
      input: validJwt,
      auto: false,
    });

    render(<JwtDecoder />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    await vi.waitFor(() => {
      expect(useJwtDecoderStore.getState().header).toContain('HS256');
      expect(useJwtDecoderStore.getState().payload).toContain('John Doe');
      expect(useJwtDecoderStore.getState().error).toBeUndefined();
    });
  });

  it('should reset store on unmount', () => {
    useJwtDecoderStore.setState({
      input: 'token-to-reset',
    });

    const { unmount } = render(<JwtDecoder />);
    unmount();

    expect(useJwtDecoderStore.getState().input).toBe('');
  });
});
