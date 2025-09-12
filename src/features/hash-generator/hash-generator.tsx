'use client';

import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { auto, fromValue, toValue, toError, setAuto, setFromValue, setToValue, setToError, reset } =
    useHashGeneratorStore();

  const handleConvert = useCallback(async () => {
    const { result, error } = await generateHash(fromValue, algo, encoding, t);
    setToValue(result);
    setToError(error);
  }, [algo, encoding, fromValue, setToValue, setToError, t]);

  useDebouncedEffect({ auto }, handleConvert, [algo, encoding, fromValue, setToValue, setToError, t]);

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
            type={SEARCH_PARAM_KEYS.ALGO}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={HashAlgoSelector}
            placeholder={t('hashGenerator.fromPlaceholder')}
            onClear={handleClear}
            onCopy={handleCopyFrom}
            onUpload={handleUpload}
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
