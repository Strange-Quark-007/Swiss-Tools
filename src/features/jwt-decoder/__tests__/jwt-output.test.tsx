import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { useJwtDecoderStore } from '../jwt-decoder-store';
import { JwtOutput } from '../jwt-output';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('JwtOutput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useJwtDecoderStore.getState().reset();

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('should render header and payload textareas with values', () => {
    useJwtDecoderStore.setState({
      header: '{\n  "alg": "HS256"\n}',
      payload: '{\n  "sub": "1234"\n}',
    });

    render(<JwtOutput />);

    const headerTextarea = screen.getByPlaceholderText(testT('jwtDecoder.header.placeholder'));
    const payloadTextarea = screen.getByPlaceholderText(testT('jwtDecoder.payload.placeholder'));

    expect((headerTextarea as HTMLTextAreaElement).value).toContain('HS256');
    expect((payloadTextarea as HTMLTextAreaElement).value).toContain('1234');
  });

  it('should toast error and render space when error is set', () => {
    useJwtDecoderStore.setState({
      error: 'Invalid JWT structure',
    });

    render(<JwtOutput />);

    expect(toast.error).toHaveBeenCalledWith('Invalid JWT structure');

    const headerTextarea = screen.getByPlaceholderText(testT('jwtDecoder.header.placeholder'));
    expect((headerTextarea as HTMLTextAreaElement).value).toBe(' ');
  });

  it('should copy header and payload when values are present', () => {
    useJwtDecoderStore.setState({
      header: '  {"alg":"HS256"}  ',
      payload: '  {"sub":"1234"}  ',
    });

    render(<JwtOutput />);

    const copyHeaderBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.header') }),
    });
    fireEvent.click(copyHeaderBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{"alg":"HS256"}');

    const copyPayloadBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.payload') }),
    });
    fireEvent.click(copyPayloadBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{"sub":"1234"}');
  });

  it('should not copy when header or payload are empty', () => {
    useJwtDecoderStore.setState({
      header: '',
      payload: '',
    });

    render(<JwtOutput />);

    const copyHeaderBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.header') }),
    });
    fireEvent.click(copyHeaderBtn);

    const copyPayloadBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.payload') }),
    });
    fireEvent.click(copyPayloadBtn);

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });
});
