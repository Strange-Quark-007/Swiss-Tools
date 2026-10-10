import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { MIME_TYPE } from '@/constants/common';

import { downloadFile } from '../download-file';

describe('downloadFile', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalCreateObjectURL) {
      URL.createObjectURL = originalCreateObjectURL;
    } else {
      delete (URL as Partial<typeof URL>).createObjectURL;
    }

    if (originalRevokeObjectURL) {
      URL.revokeObjectURL = originalRevokeObjectURL;
    } else {
      delete (URL as Partial<typeof URL>).revokeObjectURL;
    }
  });

  it('should return early without creating DOM elements if content is empty', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');

    downloadFile('', 'empty.txt', MIME_TYPE.TEXT);

    expect(createElementSpy).not.toHaveBeenCalled();
  });

  it('should create object URL, configure anchor, trigger click, and revoke URL for valid content', () => {
    const mockClick = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
    } as unknown as HTMLAnchorElement;

    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);

    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url-123');
    const mockRevokeObjectURL = vi.fn();

    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;

    downloadFile('export content', 'output.json', MIME_TYPE.JSON);

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    const createdBlob = mockCreateObjectURL.mock.calls[0][0] as Blob;
    expect(createdBlob).toBeInstanceOf(Blob);
    expect(createdBlob.type).toBe(MIME_TYPE.JSON);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockAnchor.href).toBe('blob:mock-url-123');
    expect(mockAnchor.download).toBe('output.json');
    expect(mockClick).toHaveBeenCalledTimes(1);

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url-123');
  });
});
