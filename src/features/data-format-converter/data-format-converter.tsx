'use client';

import { useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { downloadFile } from '@/lib/download-file';
import { useT } from '@/i18n/utils';

import { useDataFormatConverterStore } from './data-format-converter-store';
import { DataFormatSelector } from './data-format-selector';
import { DataFormatType, convertDataFormat, getDownloadFileMetadata } from './utils';

interface Props {
  from: DataFormatType;
  to: DataFormatType;
}

export const DataFormatConverter = ({ from, to }: Props) => {
  const t = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { auto, fromValue, toValue, toError, setAuto, setFromValue, setToValue, setToError, reset } =
    useDataFormatConverterStore();

  const handleConvert = useCallback(async () => {
    const { result, error } = await convertDataFormat(fromValue, from, to, t);
    setToValue(result);
    setToError(error);
  }, [from, to, fromValue, setToValue, setToError, t]);

  useEffect(() => {
    if (!auto) {
      return;
    }
    const debouncedConvert = debounce(handleConvert, 300);
    debouncedConvert();
    return () => debouncedConvert.cancel();
  }, [auto, handleConvert]);

  const handleSwap = () => {
    const newFromValue = toValue;
    const newToValue = fromValue;

    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });

    setFromValue(newFromValue);
    setToValue(newToValue);
    setToError(undefined);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!Object.values(MIME_TYPE).includes(file.type as MIME_TYPE)) {
      toast.error(t('converter.inputFileError'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setFromValue(event.target?.result as string);
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClear = () => setFromValue('');
  const handleCopyFrom = () => fromValue && navigator.clipboard.writeText(fromValue);
  const handleCopyTo = () => toValue && navigator.clipboard.writeText(toValue);
  const handleUpload = () => fileInputRef.current?.click();

  const handleDownload = () => {
    const { fileName, mimeType } = getDownloadFileMetadata(to);
    downloadFile(toValue, fileName, mimeType);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.json,.xml,.yaml,.toml,.csv,.ini"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <SplitView
        left={
          <ConverterPanel
            type={SEARCH_PARAM_KEYS.FROM}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={DataFormatSelector}
            placeholder={t('dataFormatConverter.fromPlaceholder')}
            onClear={handleClear}
            onCopy={handleCopyFrom}
            onUpload={handleUpload}
          />
        }
        center={
          <ConverterActions
            auto={auto}
            setAuto={setAuto}
            onConvert={handleConvert}
            onSwap={handleSwap}
            onReset={reset}
          />
        }
        right={
          <ConverterPanel
            readOnly
            type={SEARCH_PARAM_KEYS.TO}
            value={toValue}
            error={toError}
            SelectorComponent={DataFormatSelector}
            onCopy={handleCopyTo}
            onDownload={handleDownload}
          />
        }
      />
    </>
  );
};
