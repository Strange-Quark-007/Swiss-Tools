'use client';

import { useCallback, useEffect, useRef } from 'react';

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

import { CurrentTimeTicker } from './current-time-ticker';
import { useTimestampConverterStore } from './timestamp-converter-store';
import { TimestampSelector } from './timestamp-selector';
import { bulkConvertTimestamps, getSampleTimestamp, TimestampFormatType } from './utils';

interface Props {
  from: TimestampFormatType;
  to: TimestampFormatType;
}

export const TimestampConverter = ({ from, to }: Props) => {
  const { t } = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();
  const downloadFile = useDownloadFile();

  const { auto, fromValue, toValue, toError, setAuto, setFrom, setTo, setFromValue, setToValue, setToError, reset } =
    useTimestampConverterStore();

  useUnmountEffect(reset);

  const isSwappingRef = useRef(false);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useCallback(() => {
    if (isSwappingRef.current) {
      isSwappingRef.current = false;
      return;
    }

    const { result, error } = bulkConvertTimestamps(fromValue, from, to, t);
    setToValue(result);
    setToError(error);
  }, [from, to, fromValue, t, setToValue, setToError]);

  useDebouncedEffect({ auto }, handleConvert, [from, to, fromValue, t, setToValue, setToError]);

  useEffect(() => {
    setFrom(from);
    setTo(to);
  }, [from, to, setFrom, setTo]);

  const handleSwap = () => {
    isSwappingRef.current = true;

    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });
    setFromValue(toValue);
    setToValue(fromValue);
    setToError(undefined);
  };

  const handleSample = () => {
    const sample = getSampleTimestamp(from);
    setFromValue(sample);
  };

  const handleClear = () => setFromValue('');
  const handleCopyFrom = () => fromValue && navigator.clipboard.writeText(fromValue);
  const handleCopyTo = () => toValue && navigator.clipboard.writeText(toValue);
  const handleDownload = () => downloadFile(toValue, [to], MIME_TYPE.TEXT);

  return (
    <>
      <input type="file" accept=".txt" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <div className="flex flex-col gap-4 h-full">
        <CurrentTimeTicker fromFormat={from} onUseNow={setFromValue} />
        <SplitView
          left={
            <ConverterPanel
              type={SEARCH_PARAM_KEYS.FROM}
              value={fromValue}
              onTextChange={setFromValue}
              SelectorComponent={TimestampSelector}
              placeholder={t('timestampConverter.fromPlaceholder') + '\n' + t('timestampConverter.bulkInputHint')}
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
              SelectorComponent={TimestampSelector}
              onCopy={handleCopyTo}
              onDownload={handleDownload}
            />
          }
        />
      </div>
    </>
  );
};
