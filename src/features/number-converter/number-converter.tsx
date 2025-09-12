'use client';

import { useCallback } from 'react';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useFileUpload } from '@/hooks/use-file-upload';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { downloadFile } from '@/lib/download-file';
import { useT } from '@/i18n/utils';

import { useNumberConverterStore } from './number-converter-store';
import { BaseSelector } from './base-selector';
import { BaseType, convertNumbers } from './utils';

interface Props {
  from: BaseType;
  to: BaseType;
}

export const NumberConverter = ({ from, to }: Props) => {
  const t = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();

  const {
    auto,
    fromValue,
    toValue,
    toError,
    fromCustomBase,
    toCustomBase,
    setAuto,
    setFromValue,
    setToValue,
    setToError,
    setFromCustomBase,
    setToCustomBase,
    reset,
  } = useNumberConverterStore();

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useCallback(() => {
    const effectiveFromBase = from !== 'custom' ? from : fromCustomBase || undefined;
    const effectiveToBase = to !== 'custom' ? to : toCustomBase || undefined;

    const { result, error } = convertNumbers(fromValue, effectiveFromBase, effectiveToBase, t);
    setToValue(result);
    setToError(error);
  }, [from, to, fromValue, fromCustomBase, toCustomBase, setToValue, setToError, t]);

  useDebouncedEffect({ auto }, handleConvert, [
    from,
    to,
    fromValue,
    fromCustomBase,
    toCustomBase,
    setToValue,
    setToError,
    t,
  ]);

  const handleSwap = () => {
    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });

    setFromValue(toValue);
    setToValue(fromValue);
    setFromCustomBase(toCustomBase);
    setToCustomBase(fromCustomBase);
    setToError(undefined);
  };

  const handleClear = () => setFromValue('');
  const handleCopyFrom = () => fromValue && navigator.clipboard.writeText(fromValue);
  const handleCopyTo = () => toValue && navigator.clipboard.writeText(toValue);
  const handleDownload = () => downloadFile(toValue, 'output.txt', MIME_TYPE.TEXT);

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
