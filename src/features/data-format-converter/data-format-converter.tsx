'use client';

import { useCallback, useEffect } from 'react';

import { ConverterActions } from '@/components/app-converter/converter-actions';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { SplitView } from '@/components/content-layout/split-view';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import { useT } from '@/i18n/utils';

import { useDataFormatConverterStore } from './data-format-converter-store';
import { DataFormatSelector } from './data-format-selector';
import { DATA_FORMATS, DataFormatType, FORMAT_MODES, convertDataFormat } from './utils';

interface Props {
  from: DataFormatType;
  to: DataFormatType;
}

export const DataFormatConverter = ({ from, to }: Props) => {
  const { t } = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();
  const downloadFile = useDownloadFile();

  const { auto, fromValue, toValue, toError, setAuto, setFrom, setTo, setFromValue, setToValue, setToError, reset } =
    useDataFormatConverterStore();

  useUnmountEffect(reset);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, Object.values(MIME_TYPE));

  const handleConvert = useCallback(
    async (value?: string, mode?: FORMAT_MODES) => {
      const { result, error } = await convertDataFormat(
        value ?? fromValue,
        !value ? from : to,
        to,
        mode ?? FORMAT_MODES.pretty,
        t
      );
      setToValue(result);
      setToError(error);
    },
    [fromValue, from, to, t, setToValue, setToError]
  );

  useDebouncedEffect({ auto }, handleConvert, [fromValue, from, to, t, setToValue, setToError]);

  useEffect(() => {
    setFrom(from);
    setTo(to);
  }, [from, to, setFrom, setTo]);

  const handleSwap = () => {
    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });

    setFromValue(toValue);
    setToValue(fromValue);
    setToError(undefined);
  };

  const handleSample = async () => {
    const { jsonObject, jsonArray, csvString } = await import('./sample-data.json');

    const flatFormats: string[] = [DATA_FORMATS.csv.value, DATA_FORMATS.ini.value];
    const rootFormats: string[] = [DATA_FORMATS.xml.value];

    const result =
      !flatFormats.includes(from) && !flatFormats.includes(to)
        ? (
            await convertDataFormat(
              !rootFormats.includes(from) && !rootFormats.includes(to) ? jsonArray : jsonObject,
              DATA_FORMATS.json.value,
              from,
              FORMAT_MODES.pretty,
              t
            )
          ).result
        : (await convertDataFormat(csvString, DATA_FORMATS.csv.value, from, FORMAT_MODES.pretty, t)).result;

    setFromValue(result);
  };

  const handleMinify = () => handleConvert(toValue, FORMAT_MODES.minify);
  const handlePretty = () => handleConvert(toValue, FORMAT_MODES.pretty);

  const handleClear = () => setFromValue('');
  const handleCopyFrom = () => fromValue && navigator.clipboard.writeText(fromValue);
  const handleCopyTo = () => toValue && navigator.clipboard.writeText(toValue);

  const handleDownload = () => {
    downloadFile(toValue, [to], DATA_FORMATS[to].mimeType, DATA_FORMATS[to].value);
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
