'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { DataFormatType, convertDataFormat } from './utils';
import { DataFormatSelector } from './data-format-selector';

interface Props {
  from: DataFormatType;
  to: DataFormatType;
}

export const DataFormatConverter = ({ from, to }: Props) => {
  const t = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();

  const [auto, setAuto] = useState(true);
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);

  const handleConvert = useCallback(() => {
    const { result, error } = convertDataFormat(fromValue, from, to, t);
    setToValue(result);
    setToError(error);
  }, [from, to, fromValue, t]);

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

    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });

    setFromValue(newFromValue);
    setToValue(newToValue);
    setToError(undefined);
  };

  const handleReset = () => {
    setFromValue('');
    setToValue('');
    setToError(undefined);
  };

  return (
    <SplitView
      left={
        <ConverterPanel
          type={SEARCH_PARAM_KEYS.FROM}
          value={fromValue}
          onTextChange={setFromValue}
          SelectorComponent={DataFormatSelector}
          placeholder={t('dataFormatConverter.fromPlaceholder')}
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
          type={SEARCH_PARAM_KEYS.TO}
          value={toValue}
          error={toError}
          SelectorComponent={DataFormatSelector}
          readOnly
        />
      }
    />
  );
};
