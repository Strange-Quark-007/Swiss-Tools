import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { testT } from '@/test-helpers/i18n';

import { CaseConverter } from '../case-converter';
import { useCaseConverterStore } from '../case-converter-store';
import { CASES } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useBatchUrlSearchParams: vi.fn(),
  useUrlSearchParams: vi.fn(() => [CASES.uppercase.value, vi.fn()]),
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

describe('CaseConverter', () => {
  const mockBatchSetSearchParams = vi.fn();
  const mockDownloadFile = vi.fn();
  const mockOpenFileDialog = vi.fn();
  const mockHandleFileChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useCaseConverterStore.getState().reset();

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

  it('should initialize and synchronize from and to props into store', () => {
    render(<CaseConverter from={CASES.lowercase.value} to={CASES.uppercase.value} />);

    expect(useCaseConverterStore.getState().from).toBe(CASES.lowercase.value);
    expect(useCaseConverterStore.getState().to).toBe(CASES.uppercase.value);
  });

  it('should trigger convert and update output correctly', () => {
    useCaseConverterStore.setState({
      fromValue: 'hello world',
      auto: false,
    });

    render(<CaseConverter from={CASES.lowercase.value} to={CASES.uppercase.value} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    expect(useCaseConverterStore.getState().toValue).toBe('HELLO WORLD');
    expect(useCaseConverterStore.getState().toError).toBeUndefined();
  });

  it('should handle swapping from and to', () => {
    useCaseConverterStore.setState({
      fromValue: 'source text',
      toValue: 'target text',
      toError: 'some error',
    });

    render(<CaseConverter from={CASES.lowercase.value} to={CASES.uppercase.value} />);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    fireEvent.click(swapBtn);

    expect(mockBatchSetSearchParams).toHaveBeenCalledWith({
      [SEARCH_PARAM_KEYS.FROM]: CASES.uppercase.value,
      [SEARCH_PARAM_KEYS.TO]: CASES.lowercase.value,
    });
    expect(useCaseConverterStore.getState().fromValue).toBe('target text');
    expect(useCaseConverterStore.getState().toValue).toBe('source text');
    expect(useCaseConverterStore.getState().toError).toBeUndefined();
  });

  it('should populate sample text and clear input', () => {
    render(<CaseConverter from={CASES.lowercase.value} to={CASES.uppercase.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    expect(useCaseConverterStore.getState().fromValue).toContain('Lorem ipsum');

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    fireEvent.click(clearBtn);

    expect(useCaseConverterStore.getState().fromValue).toBe('');
  });

  it('should handle copy and download actions', () => {
    useCaseConverterStore.setState({
      fromValue: 'copy this input',
      toValue: 'download this output',
    });

    render(<CaseConverter from={CASES.lowercase.value} to={CASES.uppercase.value} />);

    const copyInputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyInputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('copy this input');

    const copyOutputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyOutputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('download this output');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith('download this output', [CASES.uppercase.value], MIME_TYPE.TEXT);
  });

  it('should not call clipboard when values are empty', () => {
    useCaseConverterStore.setState({
      fromValue: '',
      toValue: '',
    });

    render(<CaseConverter from={CASES.lowercase.value} to={CASES.uppercase.value} />);

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
    const { unmount } = render(<CaseConverter from={CASES.lowercase.value} to={CASES.uppercase.value} />);

    const uploadBtn = screen.getByRole('button', { name: testT('label.upload') });
    fireEvent.click(uploadBtn);
    expect(mockOpenFileDialog).toHaveBeenCalled();

    useCaseConverterStore.setState({ fromValue: 'persisted text' });
    unmount();
    expect(useCaseConverterStore.getState().fromValue).toBe('');
  });
});
