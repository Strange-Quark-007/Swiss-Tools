'use client';

import { useCallback } from 'react';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useFileUpload } from '@/hooks/use-file-upload';
import { downloadFile } from '@/lib/download-file';
import { useT } from '@/i18n/utils';

import { useEncoderDecoderStore } from './encoder-decoder-store';
import { CodecType, MODES, ModeType, Transcode } from './utils';
import { CodecSelector } from './codec-selector';

interface Props {
  codec: CodecType;
  mode: ModeType;
}

export const EncoderDecoder = ({ codec, mode }: Props) => {
  const t = useT();
  const [, setMode] = useUrlSearchParams(SEARCH_PARAM_KEYS.MODE);

  const { auto, fromValue, toValue, toError, setAuto, setFromValue, setToValue, setToError, reset } =
    useEncoderDecoderStore();

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useCallback(async () => {
    const { result, error } = await Transcode(fromValue, codec, mode, t);
    setToValue(result);
    setToError(error);
  }, [codec, mode, fromValue, setToValue, setToError, t]);

  useDebouncedEffect({ auto }, handleConvert, [codec, mode, fromValue, setToValue, setToError, t]);

  const handleSwap = () => {
    setMode(MODES[mode].inverse);
    setFromValue(toValue);
    setToValue(fromValue);
    setToError(undefined);
  };

  const handleClear = () => setFromValue('');
  const handleCopyFrom = () => fromValue && navigator.clipboard.writeText(fromValue);
  const handleCopyTo = () => toValue && navigator.clipboard.writeText(toValue);
  const handleDownload = () => downloadFile(toValue, 'output.txt', MIME_TYPE.TEXT);

  return (
    <>
      <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileChange} style={{ display: 'none' }} />
      <SplitView
        left={
          <ConverterPanel
            type={SEARCH_PARAM_KEYS.CODEC}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={CodecSelector}
            placeholder={t('encoderDecoder.fromPlaceholder', { mode })}
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
          <ConverterPanel value={toValue} error={toError} onCopy={handleCopyTo} onDownload={handleDownload} readOnly />
        }
      />
    </>
  );
};
