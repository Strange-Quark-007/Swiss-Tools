import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

import { MIME_TYPE } from '@/constants/common';
import { downloadFile } from '@/lib/download-file';

const DEFAULT_FILE_NAME = 'output';
const DEFAULT_FILE_EXT = 'txt';

/**
 * Hook to trigger client-side file downloads.
 * Generates filenames dynamically based on the current route and provided params.
 *
 * @param content - The text content to save in the file.
 * @param params - Array of strings appended to the filename (e.g., `['camelcase']` -> `case-converter-camelcase.txt`).
 * @param mimeType - The MIME type of the file.
 * @param ext - The file extension without a leading dot (defaults to 'txt').
 *
 * @returns A callback function to trigger the download.
 */
export const useDownloadFile = () => {
  const pathname = usePathname();

  return useCallback(
    (content: string, params: string[], mimeType: MIME_TYPE, ext: string = DEFAULT_FILE_EXT) => {
      const segments = pathname.split('/').filter(Boolean);
      const toolName = segments.length > 0 ? segments[segments.length - 1] : DEFAULT_FILE_NAME;

      const baseName = [toolName, ...params].filter(Boolean).join('-');

      downloadFile(content, `${baseName}.${ext}`, mimeType);
    },
    [pathname]
  );
};
