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

import { useLengthConverterStore } from './length-converter-store';
import { LengthSelector } from './length-selector';
import { bulkConvertLength, LENGTHS, LengthType } from './utils';

interface Props {
  from: LengthType;
  to: LengthType;
}

export const LengthConverter = ({ from, to }: Props) => {
  const { t } = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();

  const { auto, fromValue, toValue, toError, setAuto, setFrom, setTo, setFromValue, setToValue, setToError, reset } =
    useLengthConverterStore();

  useUnmountEffect(reset);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useEffectEvent(() => {
    const { result, error } = bulkConvertLength(fromValue, from, to, t);
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
    const randoms = Array.from({ length: 10 }, () => {
      const digits = Math.floor(Math.random() * 2) + 1;
      const min = 10 ** (digits - 1);
      const max = 10 ** digits - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });
    setFromValue(randoms.join('\n'));
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
            SelectorComponent={LengthSelector}
            placeholder={
              t('lengthConverter.fromPlaceholder', { from: LENGTHS[from].label }) + '\n' + t('converter.bulkInputHint')
            }
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
            SelectorComponent={LengthSelector}
            onCopy={handleCopyTo}
            onDownload={handleDownload}
          />
        }
      />
    </>
  );
};
