import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SEARCH_PARAM_KEYS, MIME_TYPE } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { testT } from '@/test-helpers/i18n';
import { BaseConverterState } from '@/types/base-state';
import { Option } from '@/types/selector';

import { BaseUnitConverter } from '../base-unit-converter';

vi.mock('@/hooks/use-search-params', () => ({
  useBatchUrlSearchParams: vi.fn(),
  useUrlSearchParams: vi.fn(() => ['m', vi.fn()]),
}));

vi.mock('@/hooks/use-download-file', () => ({
  useDownloadFile: vi.fn(),
}));

vi.mock('@/hooks/use-file-upload', () => ({
  useFileUpload: vi.fn(),
}));

describe('BaseUnitConverter', () => {
  const mockBatchSetSearchParams = vi.fn();
  const mockDownloadFile = vi.fn();
  const mockOpenFileUpload = vi.fn();
  const mockHandleFileChange = vi.fn();

  const mockSetAuto = vi.fn();
  const mockSetFrom = vi.fn();
  const mockSetTo = vi.fn();
  const mockSetFromValue = vi.fn();
  const mockSetToValue = vi.fn();
  const mockSetToError = vi.fn();
  const mockReset = vi.fn();

  const sampleUnits: Record<'m' | 'km', Option<'m' | 'km'>> = {
    m: { value: 'm', label: 'Meter' },
    km: { value: 'km', label: 'Kilometer' },
  };

  const mockBulkConvert = vi.fn((fromValue: string) => {
    if (fromValue === 'invalid') {
      return { result: '', error: 'Invalid syntax' };
    }
    return { result: '1000' };
  });

  let mockStoreState: BaseConverterState<'m' | 'km'>;

  const useMockStore = () => mockStoreState;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockStoreState = {
      auto: true,
      from: 'm',
      to: 'km',
      fromValue: '1',
      toValue: '1000',
      toError: undefined,
      setAuto: mockSetAuto,
      setFrom: mockSetFrom,
      setTo: mockSetTo,
      setFromValue: mockSetFromValue,
      setToValue: mockSetToValue,
      setToError: mockSetToError,
      reset: mockReset,
    };

    vi.mocked(useBatchUrlSearchParams).mockReturnValue(mockBatchSetSearchParams);
    vi.mocked(useDownloadFile).mockReturnValue(mockDownloadFile);
    vi.mocked(useFileUpload).mockReturnValue({
      fileInputRef: { current: null },
      handleFileChange: mockHandleFileChange,
      openFileDialog: mockOpenFileUpload,
    });

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  const renderConverter = (propsOverrides = {}) =>
    render(
      <BaseUnitConverter<'m' | 'km'>
        from="m"
        to="km"
        units={sampleUnits}
        useStore={useMockStore}
        bulkConvert={mockBulkConvert}
        placeholderKey="areaConverter.fromPlaceholder"
        {...propsOverrides}
      />
    );

  it('should initialize units and render panels, placeholders, and selectors', () => {
    renderConverter();

    expect(mockSetFrom).toHaveBeenCalledWith('m');
    expect(mockSetTo).toHaveBeenCalledWith('km');
    expect(screen.getByText('FROM:')).toBeDefined();
    expect(screen.getByText('TO:')).toBeDefined();

    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBe(2);
    expect(textareas[0].getAttribute('placeholder')).toContain(
      testT('areaConverter.fromPlaceholder', { from: 'Meter' })
    );
  });

  it('should trigger convert and update output values', () => {
    mockStoreState.auto = false;
    renderConverter();

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    expect(mockBulkConvert).toHaveBeenCalledWith('1', 'm', 'km', expect.any(Function));
    expect(mockSetToValue).toHaveBeenCalledWith('1000');
  });

  it('should handle swapping units and values', () => {
    renderConverter();

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    fireEvent.click(swapBtn);

    expect(mockBatchSetSearchParams).toHaveBeenCalledWith({
      [SEARCH_PARAM_KEYS.FROM]: 'km',
      [SEARCH_PARAM_KEYS.TO]: 'm',
    });
    expect(mockSetFromValue).toHaveBeenCalledWith('1000');
    expect(mockSetToValue).toHaveBeenCalledWith('1');
    expect(mockSetToError).toHaveBeenCalledWith(undefined);

    vi.advanceTimersByTime(300);
  });

  it('should handle sample generation and clear', () => {
    renderConverter();

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);
    expect(mockSetFromValue).toHaveBeenCalled();

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    fireEvent.click(clearBtn);
    expect(mockSetFromValue).toHaveBeenCalledWith('');
  });

  it('should handle copy and download actions', () => {
    renderConverter();

    const copyInputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyInputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1');

    const copyOutputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyOutputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1000');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith('1000', ['km'], MIME_TYPE.TEXT);
  });

  it('should not call clipboard.writeText when fromValue or toValue is empty', () => {
    mockStoreState.fromValue = '';
    mockStoreState.toValue = '';
    renderConverter();

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

  it('should fallback to unit key if unit is not defined in units record', () => {
    render(
      <BaseUnitConverter<'m' | 'km'>
        from={'cm' as unknown as 'm'}
        to="km"
        units={sampleUnits}
        useStore={useMockStore}
        bulkConvert={mockBulkConvert}
        placeholderKey="areaConverter.fromPlaceholder"
      />
    );

    const textareas = screen.getAllByRole('textbox');
    expect(textareas[0].getAttribute('placeholder')).toContain(testT('areaConverter.fromPlaceholder', { from: 'cm' }));
  });

  it('should handle file upload trigger', () => {
    renderConverter();

    const uploadBtn = screen.getByRole('button', { name: testT('label.upload') });
    fireEvent.click(uploadBtn);
    expect(mockOpenFileUpload).toHaveBeenCalled();
  });

  it('should reset store on unmount and on reset button click', () => {
    const { unmount } = renderConverter();

    const resetBtn = screen.getByRole('button', { name: testT('label.reset') });
    fireEvent.click(resetBtn);
    expect(mockReset).toHaveBeenCalled();

    unmount();
    expect(mockReset).toHaveBeenCalledTimes(2);
  });
});
