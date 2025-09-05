'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { useUrlSearchParams } from '@/hooks/use-search-params';
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

  const [fromFormat] = useUrlSearchParams<DataFormatType>(SEARCH_PARAM_KEYS.FROM, from);
  const [toFormat] = useUrlSearchParams<DataFormatType>(SEARCH_PARAM_KEYS.TO, to);

  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);

  const handleConverter = useCallback(() => {
    const { result, error } = convertDataFormat(fromValue, fromFormat, toFormat, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, fromFormat, toFormat, t]);

  useEffect(() => {
    const debouncedConverter = debounce(handleConverter, 300);
    debouncedConverter();
    return () => debouncedConverter.cancel();
  }, [handleConverter]);

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
