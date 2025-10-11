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

import { BaseSelector } from './base-selector';
import { useNumberConverterStore } from './number-converter-store';
import { BASES, BaseType, bulkConvertNumbers } from './utils';

interface Props {
  from: BaseType;
  to: BaseType;
}

export const NumberConverter = ({ from, to }: Props) => {
  const { t } = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();

  const {
    auto,
    fromValue,
    toValue,
    toError,
    fromCustomBase,
    toCustomBase,
    setAuto,
    setFrom,
    setTo,
    setFromValue,
    setToValue,
    setToError,
    setFromCustomBase,
    setToCustomBase,
    resetEphemeral,
    reset,
  } = useNumberConverterStore();

  useUnmountEffect(resetEphemeral);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useEffectEvent(() => {
    const effectiveFromBase = from !== 'custom' ? from : fromCustomBase || undefined;
    const effectiveToBase = to !== 'custom' ? to : toCustomBase || undefined;

    const { result, error } = bulkConvertNumbers(fromValue, effectiveFromBase, effectiveToBase, t);
    setToValue(result);
    setToError(error);
  });

  useDebouncedEffect({ auto }, handleConvert, [from, to, fromValue, fromCustomBase, toCustomBase]);

  useEffect(() => {
    setFrom(from);
    setTo(to);
  }, [from, to, setFrom, setTo]);

  const handleSwap = () => {
    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });

    setFromValue(toValue);
    setToValue(fromValue);
    setFromCustomBase(toCustomBase);
    setToCustomBase(fromCustomBase);
    setToError(undefined);
  };

  const handleSample = () => {
    const randoms = Array.from({ length: 15 }, () => {
      const digits = Math.floor(Math.random() * 3) + 2;
      const min = 10 ** (digits - 1);
      const max = 10 ** digits - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });

    const { result } = bulkConvertNumbers(
      randoms.join(','),
      BASES.decimal.value,
      from === BASES.custom.value ? fromCustomBase : from,
      t
    );
    setFromValue(result);
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
            SelectorComponent={BaseSelector}
            selectorProps={{ customBase: fromCustomBase, onCustomBaseChange: setFromCustomBase }}
            placeholder={t('numberConverter.fromPlaceholder') + '\n' + t('converter.bulkInputHint')}
            onSample={handleSample}
            onClear={handleClear}
            onCopy={handleCopyFrom}
            onUpload={openFileDialog}
          />
        }
        center={
          <ConverterActions
            auto={auto}
            disableSwap={!!toError}
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
