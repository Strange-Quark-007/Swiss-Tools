import { renderHook } from '@testing-library/react';
import React, { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { MIME_TYPE } from '@/constants/common';
import { testT } from '@/test-helpers/i18n';

import { useFileUpload } from '../use-file-upload';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('@/i18n/utils', () => ({
  useT: () => ({ t: testT }),
}));

describe('useFileUpload', () => {
  const mockToastError = toast.error as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should click the attached input ref when openFileDialog is called', () => {
    const onFileContent = vi.fn();
    const { result } = renderHook(() => useFileUpload(onFileContent, [MIME_TYPE.TEXT]));

    const mockClick = vi.fn();
    const mockInput = { click: mockClick } as unknown as HTMLInputElement;
    // Attach ref
    (result.current.fileInputRef as React.MutableRefObject<HTMLInputElement>).current = mockInput;

    result.current.openFileDialog();
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should return early without errors when no file is chosen in change event', () => {
    const onFileContent = vi.fn();
    const { result } = renderHook(() => useFileUpload(onFileContent, [MIME_TYPE.TEXT]));

    const event = {
      target: {
        files: [],
        value: 'some-path',
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    result.current.handleFileChange(event);

    expect(mockToastError).not.toHaveBeenCalled();
    expect(onFileContent).not.toHaveBeenCalled();
  });

  it('should show toast error when file MIME type is not permitted', () => {
    const onFileContent = vi.fn();
    const { result } = renderHook(() => useFileUpload(onFileContent, [MIME_TYPE.JSON]));

    const file = new File(['text content'], 'file.txt', { type: MIME_TYPE.TEXT });
    const event = {
      target: {
        files: [file],
        value: 'file.txt',
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    result.current.handleFileChange(event);

    expect(mockToastError).toHaveBeenCalledWith(testT('converter.inputFileError'));
    expect(onFileContent).not.toHaveBeenCalled();
  });

  it('should read file content and invoke onFileContent for valid MIME type', async () => {
    const onFileContent = vi.fn();
    const { result } = renderHook(() => useFileUpload(onFileContent, [MIME_TYPE.TEXT]));

    const file = new File(['hello from file'], 'document.txt', { type: MIME_TYPE.TEXT });
    const targetObj = {
      files: [file],
      value: 'document.txt',
    };
    const event = { target: targetObj } as unknown as ChangeEvent<HTMLInputElement>;

    result.current.handleFileChange(event);

    // Wait for FileReader asynchronous onload callback
    await vi.waitFor(() => {
      expect(onFileContent).toHaveBeenCalledWith('hello from file');
    });

    expect(targetObj.value).toBe('');
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('should ignore non-string reader result', () => {
    const onFileContent = vi.fn();
    const { result } = renderHook(() => useFileUpload(onFileContent, [MIME_TYPE.TEXT]));

    const originalFileReader = globalThis.FileReader;
    class MockFileReader {
      onload: ((e: ProgressEvent<FileReader>) => void) | null = null;
      readAsText() {
        if (this.onload) {
          this.onload({
            target: { result: null } as unknown as FileReader,
          } as ProgressEvent<FileReader>);
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.FileReader = MockFileReader as any;

    const file = new File(['data'], 'doc.txt', { type: MIME_TYPE.TEXT });
    const event = {
      target: { files: [file], value: 'doc.txt' },
    } as unknown as ChangeEvent<HTMLInputElement>;

    result.current.handleFileChange(event);

    expect(onFileContent).not.toHaveBeenCalled();

    globalThis.FileReader = originalFileReader;
  });
});

