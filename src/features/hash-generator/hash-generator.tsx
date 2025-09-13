'use client';

import { useCallback } from 'react';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import { useFileUpload } from '@/hooks/use-file-upload';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { downloadFile } from '@/lib/download-file';
import { useT } from '@/i18n/utils';

import { HashAlgoSelector } from './hash-algo-selector';
import { AlgoType, EncodingType, generateHash } from './utils';
import { HashEncodingSelector } from './hash-encoding-selector';
import { useHashGeneratorStore } from './hash-generator-store';

interface Props {
  algo: AlgoType;
  encoding: EncodingType;
}

export const HashGenerator = ({ algo, encoding }: Props) => {
  const t = useT();

  const { auto, fromValue, toValue, toError, setAuto, setFromValue, setToValue, setToError, reset } =
    useHashGeneratorStore();

  useUnmountEffect(reset);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useCallback(async () => {
    const { result, error } = await generateHash(fromValue, algo, encoding, t);
    setToValue(result);
    setToError(error);
  }, [algo, encoding, fromValue, setToValue, setToError, t]);

  useDebouncedEffect({ auto }, handleConvert, [algo, encoding, fromValue, setToValue, setToError, t]);

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
            type={SEARCH_PARAM_KEYS.ALGO}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={HashAlgoSelector}
            placeholder={t('hashGenerator.fromPlaceholder')}
            onClear={handleClear}
            onCopy={handleCopyFrom}
            onUpload={openFileDialog}
          />
        }
        center={<ConverterActions auto={auto} setAuto={setAuto} onConvert={handleConvert} onReset={reset} />}
        right={
          <ConverterPanel
            readOnly
            type={SEARCH_PARAM_KEYS.ENCODING}
            value={toValue}
            error={toError}
            SelectorComponent={HashEncodingSelector}
            onCopy={handleCopyTo}
            onDownload={handleDownload}
          />
        }
      />
    </>
  );
};
