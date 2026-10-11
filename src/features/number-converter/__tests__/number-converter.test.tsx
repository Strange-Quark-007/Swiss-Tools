import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { testT } from '@/test-helpers/i18n';

import { NumberConverter } from '../number-converter';
import { useNumberConverterStore } from '../number-converter-store';
import { BASES } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useBatchUrlSearchParams: vi.fn(),
  useUrlSearchParams: vi.fn(() => [BASES.decimal.value, vi.fn()]),
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

describe('NumberConverter', () => {
  const mockBatchSetSearchParams = vi.fn();
  const mockDownloadFile = vi.fn();
  const mockOpenFileDialog = vi.fn();
  const mockHandleFileChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNumberConverterStore.getState().reset();

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
    render(<NumberConverter from={BASES.decimal.value} to={BASES.binary.value} />);

    expect(useNumberConverterStore.getState().from).toBe(BASES.decimal.value);
    expect(useNumberConverterStore.getState().to).toBe(BASES.binary.value);
  });

  it('should trigger convert and update output correctly', () => {
    useNumberConverterStore.setState({
      fromValue: '42',
      auto: false,
    });

    render(<NumberConverter from={BASES.decimal.value} to={BASES.binary.value} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    expect(useNumberConverterStore.getState().toValue).toBe('101010');
    expect(useNumberConverterStore.getState().toError).toBeUndefined();
  });

  it('should support custom base conversions', () => {
    useNumberConverterStore.setState({
      fromValue: 'ff',
      fromCustomBase: '16',
      toCustomBase: '10',
      auto: false,
    });

    render(<NumberConverter from={BASES.custom.value} to={BASES.custom.value} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    expect(useNumberConverterStore.getState().toValue).toBe('255');
  });

  it('should handle undefined fallback when custom base values are empty', () => {
    useNumberConverterStore.setState({
      fromValue: '123',
      fromCustomBase: '',
      toCustomBase: '',
      auto: false,
    });

    render(<NumberConverter from={BASES.custom.value} to={BASES.custom.value} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    expect(useNumberConverterStore.getState().toError).toBeDefined();
  });

  it('should handle swapping from and to including custom bases', () => {
    useNumberConverterStore.setState({
      fromValue: '10',
      toValue: '2',
      fromCustomBase: '10',
      toCustomBase: '2',
      toError: undefined,
      auto: false,
    });

    render(<NumberConverter from={BASES.decimal.value} to={BASES.binary.value} />);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    fireEvent.click(swapBtn);

    expect(mockBatchSetSearchParams).toHaveBeenCalledWith({
      [SEARCH_PARAM_KEYS.FROM]: BASES.binary.value,
      [SEARCH_PARAM_KEYS.TO]: BASES.decimal.value,
    });
    expect(useNumberConverterStore.getState().fromValue).toBe('2');
    expect(useNumberConverterStore.getState().toValue).toBe('10');
    expect(useNumberConverterStore.getState().fromCustomBase).toBe('2');
    expect(useNumberConverterStore.getState().toCustomBase).toBe('10');

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);
    expect(useNumberConverterStore.getState().toValue).toBe('10');
  });

  it('should disable swap when there is an error in toError', () => {
    useNumberConverterStore.setState({
      fromValue: 'invalid',
      toValue: '',
      toError: 'Invalid number format',
    });

    render(<NumberConverter from={BASES.decimal.value} to={BASES.binary.value} />);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    expect(swapBtn.hasAttribute('disabled')).toBe(true);
  });

  it('should populate sample numbers and clear input', () => {
    render(<NumberConverter from={BASES.decimal.value} to={BASES.hex.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    expect(useNumberConverterStore.getState().fromValue).not.toBe('');

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    fireEvent.click(clearBtn);

    expect(useNumberConverterStore.getState().fromValue).toBe('');
  });

  it('should handle sample generation with custom base', () => {
    useNumberConverterStore.setState({
      fromCustomBase: '8',
    });

    render(<NumberConverter from={BASES.custom.value} to={BASES.decimal.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    expect(useNumberConverterStore.getState().fromValue).not.toBe('');
  });

  it('should handle copy and download actions', () => {
    useNumberConverterStore.setState({
      fromValue: '123',
      toValue: '7b',
    });

    render(<NumberConverter from={BASES.decimal.value} to={BASES.hex.value} />);

    const copyInputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyInputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('123');

    const copyOutputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyOutputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('7b');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith('7b', [BASES.hex.value], MIME_TYPE.TEXT);
  });

  it('should not call clipboard when values are empty', () => {
    useNumberConverterStore.setState({
      fromValue: '',
      toValue: '',
    });

    render(<NumberConverter from={BASES.decimal.value} to={BASES.hex.value} />);

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
    const { unmount } = render(<NumberConverter from={BASES.decimal.value} to={BASES.hex.value} />);

    const uploadBtn = screen.getByRole('button', { name: testT('label.upload') });
    fireEvent.click(uploadBtn);
    expect(mockOpenFileDialog).toHaveBeenCalled();

    useNumberConverterStore.setState({ fromValue: 'persisted text' });
    unmount();
    expect(useNumberConverterStore.getState().fromValue).toBe('');
  });
});
