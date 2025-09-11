'use client';

import { useRef, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { downloadFile } from '@/lib/download-file';
import { useT } from '@/i18n/utils';

import { useCaseConverterStore } from './case-converter-store';
import { CaseSelector } from './case-selector';
import { CaseType, convertTextCase } from './utils';

interface Props {
  from: CaseType;
  to: CaseType;
}

export const CaseConverter = ({ from, to }: Props) => {
  const t = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { auto, fromValue, toValue, toError, setAuto, setFromValue, setToValue, setToError, reset } =
    useCaseConverterStore();

  const handleConvert = useCallback(() => {
    const { result, error } = convertTextCase(fromValue, from, to, t);
    setToValue(result);
    setToError(error);
  }, [from, to, fromValue, setToValue, setToError, t]);

  useEffect(() => {
    if (!auto) {
      return;
    }
    const debouncedConvert = debounce(handleConvert, 300);
    debouncedConvert();
    return () => debouncedConvert.cancel();
  }, [auto, handleConvert]);

  const handleSwap = () => {
    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });

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
            type={SEARCH_PARAM_KEYS.FROM}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={CaseSelector}
            placeholder={t('caseConverter.fromPlaceholder') + ' ' + t('caseConverter.bulkInputHint')}
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
          <ConverterPanel
            readOnly
            type={SEARCH_PARAM_KEYS.TO}
            value={toValue}
            error={toError}
            SelectorComponent={CaseSelector}
            onCopy={handleCopyTo}
            onDownload={handleDownload}
          />
        }
      />
    </>
  );
};
