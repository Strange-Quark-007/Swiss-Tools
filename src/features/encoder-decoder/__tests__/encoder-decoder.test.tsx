import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MIME_TYPE } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { testT } from '@/test-helpers/i18n';

import { EncoderDecoder } from '../encoder-decoder';
import { useEncoderDecoderStore } from '../encoder-decoder-store';
import { CODECS, MODES } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(),
}));

vi.mock('@/hooks/use-download-file', () => ({
  useDownloadFile: vi.fn(),
}));

vi.mock('@/hooks/use-file-upload', () => ({
  useFileUpload: vi.fn(),
}));

describe('EncoderDecoder', () => {
  const mockSetSearchParamMode = vi.fn();
  const mockDownloadFile = vi.fn();
  const mockOpenFileDialog = vi.fn();
  const mockHandleFileChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useEncoderDecoderStore.getState().reset();

    vi.mocked(useUrlSearchParams).mockReturnValue([MODES.encode.value, mockSetSearchParamMode]);
    vi.mocked(useDownloadFile).mockReturnValue(mockDownloadFile);
    vi.mocked(useFileUpload).mockReturnValue({
      fileInputRef: { current: null },
      handleFileChange: mockHandleFileChange,
      openFileDialog: mockOpenFileDialog,
    });

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('should initialize and synchronize codec and mode props into store', () => {
    render(<EncoderDecoder codec={CODECS.base64.value} mode={MODES.encode.value} />);

    expect(useEncoderDecoderStore.getState().codec).toBe(CODECS.base64.value);
    expect(useEncoderDecoderStore.getState().mode).toBe(MODES.encode.value);
  });

  it('should trigger convert and update output correctly', async () => {
    useEncoderDecoderStore.setState({
      fromValue: 'hello world',
      auto: false,
    });

    render(<EncoderDecoder codec={CODECS.base64.value} mode={MODES.encode.value} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    await vi.waitFor(() => {
      expect(useEncoderDecoderStore.getState().toValue).toBe('aGVsbG8gd29ybGQ=');
      expect(useEncoderDecoderStore.getState().toError).toBeUndefined();
    });
  });

  it('should handle swapping mode and inputs', () => {
    useEncoderDecoderStore.setState({
      fromValue: 'raw text',
      toValue: 'encoded text',
      toError: 'some error',
      auto: false,
    });

    render(<EncoderDecoder codec={CODECS.base64.value} mode={MODES.encode.value} />);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    fireEvent.click(swapBtn);

    expect(mockSetSearchParamMode).toHaveBeenCalledWith(MODES.decode.value);
    expect(useEncoderDecoderStore.getState().fromValue).toBe('encoded text');
    expect(useEncoderDecoderStore.getState().toValue).toBe('raw text');
    expect(useEncoderDecoderStore.getState().toError).toBeUndefined();

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);
    expect(useEncoderDecoderStore.getState().toValue).toBe('raw text');
  });

  it('should populate sample text in encode mode and clear', async () => {
    render(<EncoderDecoder codec={CODECS.base64.value} mode={MODES.encode.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    await vi.waitFor(() => {
      expect(useEncoderDecoderStore.getState().fromValue).toContain('Thë qu1ck');
    });

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    fireEvent.click(clearBtn);

    expect(useEncoderDecoderStore.getState().fromValue).toBe('');
  });

  it('should populate sample text in decode mode with pre-encoded string', async () => {
    render(<EncoderDecoder codec={CODECS.base64.value} mode={MODES.decode.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    await vi.waitFor(() => {
      expect(useEncoderDecoderStore.getState().fromValue).not.toContain('Thë qu1ck');
      expect(useEncoderDecoderStore.getState().fromValue.length).toBeGreaterThan(0);
    });
  });

  it('should handle copy and download actions', () => {
    useEncoderDecoderStore.setState({
      fromValue: 'input copy',
      toValue: 'output copy',
    });

    render(<EncoderDecoder codec={CODECS.base64.value} mode={MODES.encode.value} />);

    const copyInputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyInputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('input copy');

    const copyOutputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyOutputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('output copy');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith(
      'output copy',
      [CODECS.base64.value, MODES.encode.value],
      MIME_TYPE.TEXT
    );
  });

  it('should not call clipboard when values are empty', () => {
    useEncoderDecoderStore.setState({
      fromValue: '',
      toValue: '',
    });

    render(<EncoderDecoder codec={CODECS.base64.value} mode={MODES.encode.value} />);

    const copyInputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyInputBtn);

    const copyOutputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyOutputBtn);

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('should trigger file upload dialog and reset on unmount', () => {
    const { unmount } = render(<EncoderDecoder codec={CODECS.base64.value} mode={MODES.encode.value} />);

    const uploadBtn = screen.getByRole('button', { name: testT('label.upload') });
    fireEvent.click(uploadBtn);
    expect(mockOpenFileDialog).toHaveBeenCalled();

    useEncoderDecoderStore.setState({ fromValue: 'persisted text' });
    unmount();
    expect(useEncoderDecoderStore.getState().fromValue).toBe('');
  });
});
