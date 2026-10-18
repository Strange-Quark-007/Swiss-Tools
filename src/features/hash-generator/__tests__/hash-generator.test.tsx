import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MIME_TYPE } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { testT } from '@/test-helpers/i18n';

import { HashGenerator } from '../hash-generator';
import { useHashGeneratorStore } from '../hash-generator-store';
import { HASH_ENCODINGS, HASHING_ALGOS } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(() => ['md5', vi.fn()]),
}));

vi.mock('@/hooks/use-download-file', () => ({
  useDownloadFile: vi.fn(),
}));

vi.mock('@/hooks/use-file-upload', () => ({
  useFileUpload: vi.fn(),
}));

describe('HashGenerator', () => {
  const mockDownloadFile = vi.fn();
  const mockOpenFileDialog = vi.fn();
  const mockHandleFileChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useHashGeneratorStore.getState().reset();

    vi.mocked(useDownloadFile).mockReturnValue(mockDownloadFile);
    vi.mocked(useFileUpload).mockReturnValue({
      fileInputRef: { current: null },
      handleFileChange: mockHandleFileChange,
      openFileDialog: mockOpenFileDialog,
    });
  });

  it('should initialize and synchronize algo and encoding props into store', () => {
    render(<HashGenerator algo={HASHING_ALGOS.md5.value} encoding={HASH_ENCODINGS.hex.value} />);

    expect(useHashGeneratorStore.getState().algo).toBe(HASHING_ALGOS.md5.value);
    expect(useHashGeneratorStore.getState().encoding).toBe(HASH_ENCODINGS.hex.value);
  });

  it('should trigger convert and update output correctly', async () => {
    useHashGeneratorStore.setState({
      fromValue: 'hello',
      auto: false,
    });

    render(<HashGenerator algo={HASHING_ALGOS.md5.value} encoding={HASH_ENCODINGS.hex.value} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    await vi.waitFor(() => {
      expect(useHashGeneratorStore.getState().toValue).toBe('5d41402abc4b2a76b9719d911017c592');
      expect(useHashGeneratorStore.getState().toError).toBeUndefined();
    });
  });

  it('should populate sample text and clear input', async () => {
    render(<HashGenerator algo={HASHING_ALGOS.md5.value} encoding={HASH_ENCODINGS.hex.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    await vi.waitFor(() => {
      expect(useHashGeneratorStore.getState().fromValue).toContain('Thë qu1ck');
    });

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    fireEvent.click(clearBtn);

    expect(useHashGeneratorStore.getState().fromValue).toBe('');
  });

  it('should handle copy and download actions', () => {
    useHashGeneratorStore.setState({
      fromValue: 'source text',
      toValue: 'hashed text',
    });

    render(<HashGenerator algo={HASHING_ALGOS.md5.value} encoding={HASH_ENCODINGS.hex.value} />);

    const copyInputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyInputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('source text');

    const copyOutputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyOutputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hashed text');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith(
      'hashed text',
      [HASHING_ALGOS.md5.value, HASH_ENCODINGS.hex.value],
      MIME_TYPE.TEXT
    );
  });

  it('should not call clipboard when values are empty', () => {
    useHashGeneratorStore.setState({
      fromValue: '',
      toValue: '',
    });

    render(<HashGenerator algo={HASHING_ALGOS.md5.value} encoding={HASH_ENCODINGS.hex.value} />);

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
    const { unmount } = render(<HashGenerator algo={HASHING_ALGOS.md5.value} encoding={HASH_ENCODINGS.hex.value} />);

    const uploadBtn = screen.getByRole('button', { name: testT('label.upload') });
    fireEvent.click(uploadBtn);
    expect(mockOpenFileDialog).toHaveBeenCalled();

    useHashGeneratorStore.setState({ fromValue: 'persisted text' });
    unmount();
    expect(useHashGeneratorStore.getState().fromValue).toBe('');
  });
});
