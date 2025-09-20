'use client';

import { useCallback, useEffect } from 'react';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import { useFileUpload } from '@/hooks/use-file-upload';
import { downloadFile } from '@/lib/download-file';
import { useT } from '@/i18n/utils';

import { useDataFormatConverterStore } from './data-format-converter-store';
import { DataFormatSelector } from './data-format-selector';
import { DATA_FORMATS, DataFormatType, FORMAT_MODES, convertDataFormat, getDownloadFileMetadata } from './utils';

interface Props {
  from: DataFormatType;
  to: DataFormatType;
}

export const DataFormatConverter = ({ from, to }: Props) => {
  const t = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();

  const {
    auto,
    fromValue,
    toValue,
    formatMode,
    toError,
    setAuto,
    setFrom,
    setTo,
    setFromValue,
    setToValue,
    setFormatMode,
    setToError,
    reset,
  } = useDataFormatConverterStore();

  useUnmountEffect(reset);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, Object.values(MIME_TYPE));

  const handleConvert = useCallback(async () => {
    const { result, error } = await convertDataFormat(fromValue, from, to, formatMode, t);
    setToValue(result);
    setToError(error);
  }, [from, to, fromValue, formatMode, setToValue, setToError, t]);

  useDebouncedEffect({ auto }, handleConvert, [from, to, fromValue, formatMode, setToValue, setToError, t]);

  useEffect(() => {
    setFrom(from);
    setTo(to);
    setFormatMode(FORMAT_MODES.pretty);
  }, [from, to, setFrom, setTo, setFormatMode]);

  const handleSwap = () => {
    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });

    setFromValue(toValue);
    setToValue(fromValue);
    setFormatMode(FORMAT_MODES.pretty);
    setToError(undefined);
  };

  const handleSample = async () => {
    const { jsonObject, jsonArray, csvString } = await import('./sample-data.json');
    let result = '';

    const flatFormats: string[] = [DATA_FORMATS.csv.value, DATA_FORMATS.ini.value];
    const rootFormats: string[] = [DATA_FORMATS.xml.value];

    if (!flatFormats.includes(from) && !flatFormats.includes(to)) {
      const data = !rootFormats.includes(from) && !rootFormats.includes(to) ? jsonArray : jsonObject;
      result = (await convertDataFormat(data, DATA_FORMATS.json.value, from, FORMAT_MODES.pretty, t)).result;
    } else {
      result = (await convertDataFormat(csvString, DATA_FORMATS.csv.value, from, FORMAT_MODES.pretty, t)).result;
    }

    setFromValue(result);
  };

  const handleMinify = () => setFormatMode(FORMAT_MODES.minify);
  const handlePretty = () => setFormatMode(FORMAT_MODES.pretty);

  const handleClear = () => setFromValue('');
  const handleCopyFrom = () => fromValue && navigator.clipboard.writeText(fromValue);
  const handleCopyTo = () => toValue && navigator.clipboard.writeText(toValue);

  const handleDownload = () => {
    const { fileName, mimeType } = getDownloadFileMetadata(to);
    downloadFile(toValue, fileName, mimeType);
  };

  return (
    <>
      <input
        type="file"
        accept=".txt,.json,.xml,.yaml,.toml,.csv,.ini"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <SplitView
        left={
          <ConverterPanel
            type={SEARCH_PARAM_KEYS.FROM}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={DataFormatSelector}
            placeholder={t('dataFormatConverter.fromPlaceholder', { from: from.toUpperCase() })}
            onSample={handleSample}
            onClear={handleClear}
            onCopy={handleCopyFrom}
            onUpload={openFileDialog}
          />
        }
        center={
          <ConverterActions
            auto={auto}
            disableSwap={!!toError}
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
            selectorProps={{ onMinify: handleMinify, onPrettyPrint: handlePretty }}
            onCopy={handleCopyTo}
            onDownload={handleDownload}
          />
        }
      />
    </>
  );
};
