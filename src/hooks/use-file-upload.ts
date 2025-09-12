import { useRef, ChangeEvent } from 'react';
import { toast } from 'sonner';

import { MIME_TYPE } from '@/constants/common';
import { useT } from '@/i18n/utils';

/**
 * Custom hook to handle file uploads with MIME type validation.
 *
 * @param onFileContent - Callback invoked with the file's content when a valid file is selected.
 * @param allowedMimeTypes - Array of allowed MIME types.
 *
 * @returns An object containing:
 *  - `fileInputRef`: ref to attach to the file input element.
 *  - `handleFileChange`: onChange handler for the file input.
 *  - `openFileDialog`: function to open the file picker.
 */
export function useFileUpload(onFileContent: (content: string) => void, allowedMimeTypes: MIME_TYPE[]) {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!allowedMimeTypes.includes(file.type as MIME_TYPE)) {
      toast.error(t('converter.inputFileError'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        onFileContent(content);
      }
    };
    reader.readAsText(file);

    event.target.value = '';
  };

  const openFileDialog = () => fileInputRef.current?.click();

  return { fileInputRef, handleFileChange, openFileDialog };
}
