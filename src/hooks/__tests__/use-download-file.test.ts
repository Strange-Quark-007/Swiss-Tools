import { renderHook } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { MIME_TYPE } from '@/constants/common';
import { downloadFile } from '@/lib/download-file';

import { useDownloadFile } from '../use-download-file';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/lib/download-file', () => ({
  downloadFile: vi.fn(),
}));

describe('useDownloadFile', () => {
  const mockUsePathname = usePathname as Mock;
  const mockDownloadFile = downloadFile as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should format filename using last pathname segment and params with default txt extension', () => {
    mockUsePathname.mockReturnValue('/unit-converter/length');

    const { result } = renderHook(() => useDownloadFile());
    result.current('100m in km', ['m', 'km'], MIME_TYPE.TEXT);

    expect(mockDownloadFile).toHaveBeenCalledWith('100m in km', 'length-m-km.txt', MIME_TYPE.TEXT);
  });

  it('should support custom file extensions', () => {
    mockUsePathname.mockReturnValue('/case-converter');

    const { result } = renderHook(() => useDownloadFile());
    result.current('{"data": 1}', ['lowercase'], MIME_TYPE.JSON, 'json');

    expect(mockDownloadFile).toHaveBeenCalledWith('{"data": 1}', 'case-converter-lowercase.json', MIME_TYPE.JSON);
  });

  it('should fall back to "output" when pathname has no valid segments', () => {
    mockUsePathname.mockReturnValue('/');

    const { result } = renderHook(() => useDownloadFile());
    result.current('raw text', [], MIME_TYPE.TEXT);

    expect(mockDownloadFile).toHaveBeenCalledWith('raw text', 'output.txt', MIME_TYPE.TEXT);
  });

  it('should filter out empty strings in params list', () => {
    mockUsePathname.mockReturnValue('/hash-generator');

    const { result } = renderHook(() => useDownloadFile());
    result.current('hash', ['sha256', '', 'hex'], MIME_TYPE.TEXT);

    expect(mockDownloadFile).toHaveBeenCalledWith('hash', 'hash-generator-sha256-hex.txt', MIME_TYPE.TEXT);
  });
});
