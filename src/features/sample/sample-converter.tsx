'use client';

import { useEffect, useEffectEvent } from 'react';

import { ConverterActions } from '@/components/app-converter/converter-actions';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { SplitView } from '@/components/content-layout/split-view';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import { useT } from '@/i18n/utils';
import { downloadFile } from '@/lib/download-file';

import { useSampleConverterStore } from './sample-converter-store';
import { SampleSelector } from './sample-selector';
import { bulkConvertSample, SampleType } from './utils';

interface Props {
  from: SampleType;
  to: SampleType;
}

export const Sample = ({ from, to }: Props) => {
  const { t } = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();

  const { auto, fromValue, toValue, toError, setAuto, setFrom, setTo, setFromValue, setToValue, setToError, reset } =
    useSampleConverterStore();

  useUnmountEffect(reset);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useEffectEvent(() => {
    const { result, error } = bulkConvertSample(fromValue, from, to, t);
    setToValue(result);
    setToError(error);
  });

  useDebouncedEffect({ auto }, handleConvert, [from, to, fromValue]);

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

  const handleSample = () => {
    setFromValue('');
  };

  const handleClear = () => setFromValue('');
  const handleCopyFrom = () => fromValue && navigator.clipboard.writeText(fromValue);
  const handleCopyTo = () => toValue && navigator.clipboard.writeText(toValue);
  const handleDownload = () => downloadFile(toValue, 'output.txt', MIME_TYPE.TEXT);

  return (
    <>
      <input type="file" accept=".txt" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <SplitView
        left={
          <ConverterPanel
            type={SEARCH_PARAM_KEYS.FROM}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={SampleSelector}
            onSample={handleSample}
            onClear={handleClear}
            onCopy={handleCopyFrom}
            onUpload={openFileDialog}
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
            SelectorComponent={SampleSelector}
            onCopy={handleCopyTo}
            onDownload={handleDownload}
          />
        }
      />
    </>
  );
};
