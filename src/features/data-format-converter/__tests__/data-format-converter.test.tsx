import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { testT } from '@/test-helpers/i18n';

import { DataFormatConverter } from '../data-format-converter';
import { useDataFormatConverterStore } from '../data-format-converter-store';
import { DATA_FORMATS } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useBatchUrlSearchParams: vi.fn(),
  useUrlSearchParams: vi.fn(() => ['json', vi.fn()]),
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

describe('DataFormatConverter', () => {
  const mockBatchSetSearchParams = vi.fn();
  const mockDownloadFile = vi.fn();
  const mockOpenFileDialog = vi.fn();
  const mockHandleFileChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDataFormatConverterStore.getState().reset();

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
    render(<DataFormatConverter from={DATA_FORMATS.json.value} to={DATA_FORMATS.yaml.value} />);

    expect(useDataFormatConverterStore.getState().from).toBe(DATA_FORMATS.json.value);
    expect(useDataFormatConverterStore.getState().to).toBe(DATA_FORMATS.yaml.value);
  });

  it('should trigger convert and update output correctly', async () => {
    useDataFormatConverterStore.setState({
      fromValue: '{"name":"SwissTools"}',
      auto: false,
    });

    render(<DataFormatConverter from={DATA_FORMATS.json.value} to={DATA_FORMATS.yaml.value} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    await vi.waitFor(() => {
      expect(useDataFormatConverterStore.getState().toValue).toContain('name: SwissTools');
      expect(useDataFormatConverterStore.getState().toError).toBeUndefined();
    });
  });

  it('should handle swapping from and to when there is no error', () => {
    useDataFormatConverterStore.setState({
      fromValue: '{"a":1}',
      toValue: 'a: 1\n',
      toError: undefined,
      auto: false,
    });

    render(<DataFormatConverter from={DATA_FORMATS.json.value} to={DATA_FORMATS.yaml.value} />);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    fireEvent.click(swapBtn);

    expect(mockBatchSetSearchParams).toHaveBeenCalledWith({
      [SEARCH_PARAM_KEYS.FROM]: DATA_FORMATS.yaml.value,
      [SEARCH_PARAM_KEYS.TO]: DATA_FORMATS.json.value,
    });
    expect(useDataFormatConverterStore.getState().fromValue).toBe('a: 1\n');
    expect(useDataFormatConverterStore.getState().toValue).toBe('{"a":1}');

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);
    expect(useDataFormatConverterStore.getState().toValue).toBe('{"a":1}');
  });

  it('should disable swap when there is an error in toError', () => {
    useDataFormatConverterStore.setState({
      fromValue: 'invalid',
      toValue: '',
      toError: 'Parse error',
    });

    render(<DataFormatConverter from={DATA_FORMATS.json.value} to={DATA_FORMATS.yaml.value} />);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    expect(swapBtn.hasAttribute('disabled')).toBe(true);
  });

  it('should populate sample text and clear input', async () => {
    render(<DataFormatConverter from={DATA_FORMATS.json.value} to={DATA_FORMATS.yaml.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    await vi.waitFor(() => {
      expect(useDataFormatConverterStore.getState().fromValue).not.toBe('');
    });

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    fireEvent.click(clearBtn);

    expect(useDataFormatConverterStore.getState().fromValue).toBe('');
  });

  it('should populate sample text with rootFormats when xml is used', async () => {
    render(<DataFormatConverter from={DATA_FORMATS.xml.value} to={DATA_FORMATS.json.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    await vi.waitFor(() => {
      expect(useDataFormatConverterStore.getState().fromValue).toContain('<');
    });
  });

  it('should populate sample text with flatFormats when csv is used', async () => {
    render(<DataFormatConverter from={DATA_FORMATS.csv.value} to={DATA_FORMATS.json.value} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    fireEvent.click(sampleBtn);

    await vi.waitFor(() => {
      expect(useDataFormatConverterStore.getState().fromValue).not.toBe('');
    });
  });

  it('should handle minify and pretty print actions', async () => {
    useDataFormatConverterStore.setState({
      fromValue: '{"a":1}',
      toValue: '{\n  "a": 1\n}',
    });

    render(<DataFormatConverter from={DATA_FORMATS.yaml.value} to={DATA_FORMATS.json.value} />);

    const minifyBtn = screen.getByRole('button', { name: testT('label.minify') });
    fireEvent.click(minifyBtn);

    await vi.waitFor(() => {
      expect(useDataFormatConverterStore.getState().toValue).toBe('{"a":1}');
    });

    const prettyBtn = screen.getByRole('button', { name: testT('label.prettyPrint') });
    fireEvent.click(prettyBtn);

    await vi.waitFor(() => {
      expect(useDataFormatConverterStore.getState().toValue).toContain('\n');
    });
  });

  it('should handle copy and download actions', () => {
    useDataFormatConverterStore.setState({
      fromValue: '{"hello":"world"}',
      toValue: 'hello: world',
    });

    render(<DataFormatConverter from={DATA_FORMATS.json.value} to={DATA_FORMATS.yaml.value} />);

    const copyInputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    fireEvent.click(copyInputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{"hello":"world"}');

    const copyOutputBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyOutputBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello: world');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith(
      'hello: world',
      [DATA_FORMATS.yaml.value],
      DATA_FORMATS.yaml.mimeType,
      DATA_FORMATS.yaml.value
    );
  });

  it('should not call clipboard when values are empty', () => {
    useDataFormatConverterStore.setState({
      fromValue: '',
      toValue: '',
    });

    render(<DataFormatConverter from={DATA_FORMATS.json.value} to={DATA_FORMATS.yaml.value} />);

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
    const { unmount } = render(<DataFormatConverter from={DATA_FORMATS.json.value} to={DATA_FORMATS.yaml.value} />);

    const uploadBtn = screen.getByRole('button', { name: testT('label.upload') });
    fireEvent.click(uploadBtn);
    expect(mockOpenFileDialog).toHaveBeenCalled();

    useDataFormatConverterStore.setState({ fromValue: 'persisted text' });
    unmount();
    expect(useDataFormatConverterStore.getState().fromValue).toBe('');
  });
});
