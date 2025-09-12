'use client';

import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { auto, fromValue, toValue, toError, setAuto, setFromValue, setToValue, setToError, reset } =
    useEncoderDecoderStore();

  const handleConvert = useCallback(() => {
    const { result, error } = Transcode(fromValue, codec, mode, t);
    setToValue(result);
    setToError(error);
  }, [codec, mode, fromValue, setToValue, setToError, t]);

  useEffect(() => {
    if (!auto) {
      return;
    }
    const debouncedConvert = debounce(handleConvert, 300);
    debouncedConvert();
    return () => debouncedConvert.cancel();
  }, [auto, handleConvert]);

  const handleSwap = () => {
    setMode(MODES[mode].inverse);
    setFromValue(toValue);
    setToValue(fromValue);
    setToError(undefined);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== MIME_TYPE.TEXT) {
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
          <ConverterPanel value={toValue} error={toError} onCopy={handleCopyTo} onDownload={handleDownload} readOnly />
        }
      />
    </>
  );
};
