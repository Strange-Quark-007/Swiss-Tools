import { MIME_TYPE } from '@/constants/common';

/**
 * Trigger a client-side download of a file with the given content.
 *
 * @param content - The text content to save in the file.
 * @param filename - The desired filename for the downloaded file (including extension).
 * @param type - The MIME type of the file. Use values from the MIME_TYPE enum.
 */
export function downloadFile(content: string, filename: string, type: MIME_TYPE) {
  if (!content) {
    return;
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
