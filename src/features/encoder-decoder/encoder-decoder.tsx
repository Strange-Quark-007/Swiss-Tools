'use client';

import { useEffect, useEffectEvent } from 'react';

import { ConverterActions } from '@/components/app-converter/converter-actions';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { SplitView } from '@/components/content-layout/split-view';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import { useT } from '@/i18n/utils';
import { downloadFile } from '@/lib/download-file';

import { CodecSelector } from './codec-selector';
import { useEncoderDecoderStore } from './encoder-decoder-store';
import { CodecType, MODES, ModeType, Transcode } from './utils';

interface Props {
  codec: CodecType;
  mode: ModeType;
}

export const EncoderDecoder = ({ codec, mode }: Props) => {
  const { t } = useT();
  const [, setSearchParamMode] = useUrlSearchParams(SEARCH_PARAM_KEYS.MODE);

  const { auto, fromValue, toValue, toError, setAuto, setCodec, setMode, setFromValue, setToValue, setToError, reset } =
    useEncoderDecoderStore();

  useUnmountEffect(reset);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useEffectEvent(async () => {
    const { result, error } = await Transcode(fromValue, codec, mode, t);
    setToValue(result);
    setToError(error);
  });

  useDebouncedEffect({ auto }, handleConvert, [codec, mode, fromValue]);

  useEffect(() => {
    setCodec(codec);
    setMode(mode);
  }, [codec, mode, setCodec, setMode]);

  const handleSwap = () => {
    setSearchParamMode(MODES[mode].inverse);
    setFromValue(toValue);
    setToValue(fromValue);
    setToError(undefined);
  };

  const handleSample = async () => {
    let sample = '✨ Thë qu1ck brówn fóx jump$ över thé l@zy dóg 🔥';

    if (mode === MODES.decode.value) {
      const { result } = await Transcode(sample, codec, MODES.encode.value, t);
      sample = result;
    }

    setFromValue(sample);
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
            type={SEARCH_PARAM_KEYS.CODEC}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={CodecSelector}
            placeholder={t('encoderDecoder.fromPlaceholder', { mode })}
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
          <ConverterPanel value={toValue} error={toError} onCopy={handleCopyTo} onDownload={handleDownload} readOnly />
        }
      />
    </>
  );
};
