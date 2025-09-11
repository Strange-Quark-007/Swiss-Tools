'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { downloadFile } from '@/lib/download-file';
import { useT } from '@/i18n/utils';

import { BaseSelector } from './base-selector';
import { BaseType, convertNumbers } from './utils';

interface Props {
  from: BaseType;
  to: BaseType;
}

export const NumberConverter = ({ from, to }: Props) => {
  const t = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [auto, setAuto] = useState(true);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [toError, setToError] = useState<string | undefined>(undefined);
  const [fromCustomBase, setFromCustomBase] = useState('');
  const [toCustomBase, setToCustomBase] = useState('');

  const handleConvert = useCallback(() => {
    const effectiveFromBase = from !== 'custom' ? from : fromCustomBase || undefined;
    const effectiveToBase = to !== 'custom' ? to : toCustomBase || undefined;

    const { result, error } = convertNumbers(fromValue, effectiveFromBase, effectiveToBase, t);
    setToValue(result);
    setToError(error);
  }, [from, to, fromValue, fromCustomBase, toCustomBase, t]);

  useEffect(() => {
    if (!auto) {
      return;
    }
    const debouncedConvert = debounce(handleConvert, 300);
    debouncedConvert();
    return () => debouncedConvert.cancel();
  }, [auto, handleConvert]);

  const handleSwap = () => {
    const newFromValue = toValue;
    const newToValue = fromValue;
    const newFromCustomBase = toCustomBase;
    const newToCustomBase = fromCustomBase;

    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });

    setFromValue(newFromValue);
    setToValue(newToValue);
    setFromCustomBase(newFromCustomBase);
    setToCustomBase(newToCustomBase);
    setToError(undefined);
  };

  const handleReset = () => {
    setFromValue('');
    setToValue('');
    setToError(undefined);
    setFromCustomBase('');
    setToCustomBase('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.type !== MIME_TYPE.TEXT) {
      toast.error(t('numberConverter.inputFileError'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFromValue(event.target?.result as string);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    setFromValue('');
  };

  const handleCopyFrom = () => {
    if (fromValue) {
      navigator.clipboard.writeText(fromValue);
    }
  };

  const handleCopyTo = () => {
    if (toValue) {
      navigator.clipboard.writeText(toValue);
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    downloadFile(toValue, 'output.txt', MIME_TYPE.TEXT);
  };

  return (
    <>
      <input type="file" accept=".txt" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
      <SplitView
        left={
          <ConverterPanel
            type={SEARCH_PARAM_KEYS.FROM}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={BaseSelector}
            selectorProps={{ customBase: fromCustomBase, onCustomBaseChange: setFromCustomBase }}
            placeholder={t('numberConverter.fromPlaceholder') + ' ' + t('numberConverter.bulkInputHint')}
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
            onReset={handleReset}
          />
        }
        right={
          <ConverterPanel
            readOnly
            type={SEARCH_PARAM_KEYS.TO}
            value={toValue}
            error={toError}
            SelectorComponent={BaseSelector}
            selectorProps={{ customBase: toCustomBase, onCustomBaseChange: setToCustomBase }}
            onCopy={handleCopyTo}
            onDownload={handleDownload}
          />
        }
      />
    </>
  );
};
