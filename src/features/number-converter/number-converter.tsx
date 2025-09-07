'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { useBatchUrlSearchParams, useUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
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

  const [fromBase] = useUrlSearchParams<BaseType>(SEARCH_PARAM_KEYS.FROM, from);
  const [toBase] = useUrlSearchParams<BaseType>(SEARCH_PARAM_KEYS.TO, to);

  const [auto, setAuto] = useState(true);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [toError, setToError] = useState<string | undefined>(undefined);
  const [fromCustomBase, setFromCustomBase] = useState('');
  const [toCustomBase, setToCustomBase] = useState('');

  const handleConverter = useCallback(() => {
    const effectiveFromBase = fromBase !== 'custom' ? fromBase : fromCustomBase || undefined;
    const effectiveToBase = toBase !== 'custom' ? toBase : toCustomBase || undefined;

    const { result, error } = convertNumbers(fromValue, effectiveFromBase, effectiveToBase, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, fromBase, toBase, fromCustomBase, toCustomBase, t]);

  useEffect(() => {
    if (!auto) {
      return;
    }
    const debouncedConverter = debounce(handleConverter, 300);
    debouncedConverter();
    return () => debouncedConverter.cancel();
  }, [auto, handleConverter]);

  const handleSwap = () => {
    const newFromValue = toValue;
    const newToValue = fromValue;
    const newFromCustomBase = toCustomBase;
    const newToCustomBase = fromCustomBase;

    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: toBase, [SEARCH_PARAM_KEYS.TO]: fromBase });

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

  return (
    <SplitView
      left={
        <ConverterPanel
          type={SEARCH_PARAM_KEYS.FROM}
          value={fromValue}
          onTextChange={setFromValue}
          SelectorComponent={BaseSelector}
          selectorProps={{ customBase: fromCustomBase, onCustomBaseChange: setFromCustomBase }}
          placeholder={t('numberConverter.fromPlaceholder') + ' ' + t('numberConverter.bulkInputHint')}
        />
      }
      center={
        <ConverterActions
          auto={auto}
          setAuto={setAuto}
          onConvert={handleConverter}
          onSwap={handleSwap}
          onReset={handleReset}
        />
      }
      right={
        <ConverterPanel
          type={SEARCH_PARAM_KEYS.TO}
          value={toValue}
          error={toError}
          SelectorComponent={BaseSelector}
          selectorProps={{ customBase: toCustomBase, onCustomBaseChange: setToCustomBase }}
          readOnly
        />
      }
    />
  );
};
