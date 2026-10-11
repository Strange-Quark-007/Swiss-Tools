import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { testT } from '@/test-helpers/i18n';

import { Sample } from '../sample-converter';
import { useSampleConverterStore } from '../sample-converter-store';
import { SAMPLE } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useBatchUrlSearchParams: vi.fn(),
  useUrlSearchParams: vi.fn(() => [SAMPLE.sample.value, vi.fn()]),
}));

vi.mock('@/hooks/use-download-file', () => ({
  useDownloadFile: vi.fn(),
}));

vi.mock('@/hooks/use-file-upload', () => ({
  useFileUpload: vi.fn(),
}));

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: () => vi.fn(),
}));

describe('Sample component', () => {
  const mockBatchSetSearchParams = vi.fn();
  const mockDownloadFile = vi.fn();
  const mockOpenFileDialog = vi.fn();
  const mockHandleFileChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useSampleConverterStore.getState().reset();

    vi.mocked(useBatchUrlSearchParams).mockReturnValue(mockBatchSetSearchParams);
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

  it('should initialize and synchronize props into store', () => {
    render(<Sample from={SAMPLE.sample.value} to={SAMPLE.sample.value} />);

    expect(useSampleConverterStore.getState().from).toBe(SAMPLE.sample.value);
    expect(useSampleConverterStore.getState().to).toBe(SAMPLE.sample.value);
  });

  it('should trigger convert and update output correctly', () => {
    useSampleConverterStore.setState({
      fromValue: 'test input',
      auto: false,
    });

    render(<Sample from={SAMPLE.sample.value} to={SAMPLE.sample.value} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    expect(useSampleConverterStore.getState().toValue).toBe('');
    expect(useSampleConverterStore.getState().toError).toBeUndefined();
  });

  it('should handle swapping from and to', () => {
    useSampleConverterStore.setState({
      fromValue: 'source text',
      toValue: 'target text',
      toError: 'error',
    });

    render(<Sample from={SAMPLE.sample.value} to={SAMPLE.sample.value} />);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    fireEvent.click(swapBtn);

    expect(mockBatchSetSearchParams).toHaveBeenCalledWith({
      [SEARCH_PARAM_KEYS.FROM]: SAMPLE.sample.value,
      [SEARCH_PARAM_KEYS.TO]: SAMPLE.sample.value,
    });
    expect(useSampleConverterStore.getState().fromValue).toBe('target text');
    expect(useSampleConverterStore.getState().toValue).toBe('source text');
    expect(useSampleConverterStore.getState().toError).toBeUndefined();
  });

  it('should handle sample click and clear', () => {
    render(<Sample from={SAMPLE.sample.value} to={SAMPLE.sample.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);
    expect(useSampleConverterStore.getState().fromValue).toBe('');

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    fireEvent.click(clearBtn);
    expect(useSampleConverterStore.getState().fromValue).toBe('');
  });

  it('should handle copy and download actions', () => {
    useSampleConverterStore.setState({
      fromValue: 'input to copy',
      toValue: 'output to copy',
    });

    render(<Sample from={SAMPLE.sample.value} to={SAMPLE.sample.value} />);

    const copyInputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyInputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('input to copy');

    const copyOutputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyOutputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('output to copy');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith('output to copy', [SAMPLE.sample.value], MIME_TYPE.TEXT);
  });

  it('should not call clipboard when values are empty', () => {
    useSampleConverterStore.setState({
      fromValue: '',
      toValue: '',
    });

    render(<Sample from={SAMPLE.sample.value} to={SAMPLE.sample.value} />);

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
    const { unmount } = render(<Sample from={SAMPLE.sample.value} to={SAMPLE.sample.value} />);

    const uploadBtn = screen.getByRole('button', { name: testT('label.upload') });
    fireEvent.click(uploadBtn);
    expect(mockOpenFileDialog).toHaveBeenCalled();

    useSampleConverterStore.setState({ fromValue: 'persisted text' });
    unmount();
    expect(useSampleConverterStore.getState().fromValue).toBe('');
  });
});
