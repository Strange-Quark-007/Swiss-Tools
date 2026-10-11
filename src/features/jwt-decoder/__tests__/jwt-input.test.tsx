import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { useJwtDecoderStore } from '../jwt-decoder-store';
import { JwtInput } from '../jwt-input';

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: () => vi.fn(),
}));

describe('JwtInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useJwtDecoderStore.getState().reset();

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('should render textarea and handle input changes', () => {
    render(<JwtInput />);

    const textarea = screen.getByPlaceholderText(testT('jwtDecoder.input.placeholder'));
    fireEvent.change(textarea, { target: { value: 'custom.jwt.token' } });

    expect(useJwtDecoderStore.getState().input).toBe('custom.jwt.token');
  });

  it('should populate sample JWT and clear input', () => {
    render(<JwtInput />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    expect(useJwtDecoderStore.getState().input).toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    fireEvent.click(clearBtn);

    expect(useJwtDecoderStore.getState().input).toBe('');
  });

  it('should copy input when present', () => {
    useJwtDecoderStore.setState({ input: 'test.token' });

    render(<JwtInput />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test.token');
  });

  it('should do nothing on copy when input is empty', () => {
    useJwtDecoderStore.setState({ input: '' });

    render(<JwtInput />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });
});
