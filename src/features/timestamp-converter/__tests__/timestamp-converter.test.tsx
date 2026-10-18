import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { testT } from '@/test-helpers/i18n';

import { TimestampConverter } from '../timestamp-converter';
import { useTimestampConverterStore } from '../timestamp-converter-store';
import { TIMESTAMP_FORMATS } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useBatchUrlSearchParams: vi.fn(),
  useUrlSearchParams: vi.fn(() => [TIMESTAMP_FORMATS.unixSec.value, vi.fn()]),
}));

vi.mock('../current-time-ticker', () => ({
  CurrentTimeTicker: () => null,
}));

describe('TimestampConverter', () => {
  const mockBatchSetSearchParams = vi.fn();
  const mockDownloadFile = vi.fn();
  const mockOpenFileDialog = vi.fn();
  const mockHandleFileChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useTimestampConverterStore.getState().reset();

    vi.mocked(useBatchUrlSearchParams).mockReturnValue(mockBatchSetSearchParams);
    vi.mocked(useDownloadFile).mockReturnValue(mockDownloadFile);
    vi.mocked(useFileUpload).mockReturnValue({
      fileInputRef: { current: null },
      handleFileChange: mockHandleFileChange,
      openFileDialog: mockOpenFileDialog,
    });
  });

  it('should initialize and synchronize from and to props into store', () => {
    render(<TimestampConverter from={TIMESTAMP_FORMATS.unixSec.value} to={TIMESTAMP_FORMATS.iso8601.value} />);

    expect(useTimestampConverterStore.getState().from).toBe(TIMESTAMP_FORMATS.unixSec.value);
    expect(useTimestampConverterStore.getState().to).toBe(TIMESTAMP_FORMATS.iso8601.value);
  });

  it('should trigger convert and update output correctly', () => {
    useTimestampConverterStore.setState({
      fromValue: '1718000000',
      auto: false,
    });

    render(<TimestampConverter from={TIMESTAMP_FORMATS.unixSec.value} to={TIMESTAMP_FORMATS.iso8601.value} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    expect(useTimestampConverterStore.getState().toValue).toBe('2024-06-10T06:13:20.000Z');
    expect(useTimestampConverterStore.getState().toError).toBeUndefined();
  });

  it('should handle swapping from and to', () => {
    useTimestampConverterStore.setState({
      fromValue: '1718000000',
      toValue: '2024-06-10T06:13:20.000Z',
      toError: undefined,
      auto: false,
    });

    render(<TimestampConverter from={TIMESTAMP_FORMATS.unixSec.value} to={TIMESTAMP_FORMATS.iso8601.value} />);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    fireEvent.click(swapBtn);

    expect(mockBatchSetSearchParams).toHaveBeenCalledWith({
      [SEARCH_PARAM_KEYS.FROM]: TIMESTAMP_FORMATS.iso8601.value,
      [SEARCH_PARAM_KEYS.TO]: TIMESTAMP_FORMATS.unixSec.value,
    });
    expect(useTimestampConverterStore.getState().fromValue).toBe('2024-06-10T06:13:20.000Z');
    expect(useTimestampConverterStore.getState().toValue).toBe('1718000000');
    expect(useTimestampConverterStore.getState().toError).toBeUndefined();

    // Trigger convert while isSwappingRef.current is true to verify early return guard
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);
    expect(useTimestampConverterStore.getState().toValue).toBe('1718000000');
  });

  it('should disable swap when there is an error in toError', () => {
    useTimestampConverterStore.setState({
      fromValue: 'invalid',
      toValue: '',
      toError: 'Invalid timestamp',
    });

    render(<TimestampConverter from={TIMESTAMP_FORMATS.unixSec.value} to={TIMESTAMP_FORMATS.iso8601.value} />);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    expect(swapBtn.hasAttribute('disabled')).toBe(true);
  });

  it('should populate sample timestamps and clear input', () => {
    render(<TimestampConverter from={TIMESTAMP_FORMATS.unixSec.value} to={TIMESTAMP_FORMATS.iso8601.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    expect(useTimestampConverterStore.getState().fromValue.length).toBeGreaterThan(0);

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    fireEvent.click(clearBtn);

    expect(useTimestampConverterStore.getState().fromValue).toBe('');
  });

  it('should handle copy and download actions', () => {
    useTimestampConverterStore.setState({
      fromValue: '1718000000',
      toValue: '2024-06-10T06:13:20.000Z',
    });

    render(<TimestampConverter from={TIMESTAMP_FORMATS.unixSec.value} to={TIMESTAMP_FORMATS.iso8601.value} />);

    const copyInputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyInputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1718000000');

    const copyOutputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyOutputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('2024-06-10T06:13:20.000Z');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith(
      '2024-06-10T06:13:20.000Z',
      [TIMESTAMP_FORMATS.iso8601.value],
      MIME_TYPE.TEXT
    );
  });

  it('should not call clipboard when values are empty', () => {
    useTimestampConverterStore.setState({
      fromValue: '',
      toValue: '',
    });

    render(<TimestampConverter from={TIMESTAMP_FORMATS.unixSec.value} to={TIMESTAMP_FORMATS.iso8601.value} />);

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
    const { unmount } = render(
      <TimestampConverter from={TIMESTAMP_FORMATS.unixSec.value} to={TIMESTAMP_FORMATS.iso8601.value} />
    );

    const uploadBtn = screen.getByRole('button', { name: testT('label.upload') });
    fireEvent.click(uploadBtn);
    expect(mockOpenFileDialog).toHaveBeenCalled();

    useTimestampConverterStore.setState({ fromValue: 'persisted text' });
    unmount();
    expect(useTimestampConverterStore.getState().fromValue).toBe('');
  });
});
