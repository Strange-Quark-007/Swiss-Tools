'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConversionPanel } from '@/components/app-conversion/conversion-panel';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { DataFormatType, convertDataFormat } from './utils';
import { DataFormatSelector } from './data-format-selector';

interface Props {
  from: DataFormatType;
  to: DataFormatType;
}

export const DataFormatConversion = ({ from, to }: Props) => {
  const t = useT();

  const [fromFormat] = useUrlSearchParams<DataFormatType>(SEARCH_PARAM_KEYS.FROM, from);
  const [toFormat] = useUrlSearchParams<DataFormatType>(SEARCH_PARAM_KEYS.TO, to);

  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);

  const handleConversion = useCallback(() => {
    const { result, error } = convertDataFormat(fromValue, fromFormat, toFormat, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, fromFormat, toFormat, t]);

  useEffect(() => {
    const debouncedConversion = debounce(handleConversion, 300);
    debouncedConversion();
    return () => debouncedConversion.cancel();
  }, [handleConversion]);

  return (
    <SplitView
      left={
        <ConversionPanel
          type={SEARCH_PARAM_KEYS.FROM}
          value={fromValue}
          onTextChange={setFromValue}
          SelectorComponent={DataFormatSelector}
          placeholder={t('dataFormatConversion.fromPlaceholder')}
        />
      }
      right={
        <ConversionPanel
          type={SEARCH_PARAM_KEYS.TO}
          value={toValue}
          error={toError}
          onTextChange={() => {}}
          SelectorComponent={DataFormatSelector}
        />
      }
    />
  );
};
