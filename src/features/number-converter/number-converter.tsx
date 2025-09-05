'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { useUrlSearchParams } from '@/hooks/use-search-params';
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

  const [fromBase] = useUrlSearchParams<BaseType>(SEARCH_PARAM_KEYS.FROM, from);
  const [toBase] = useUrlSearchParams<BaseType>(SEARCH_PARAM_KEYS.TO, to);

  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);
  const [fromCustomBase, setFromCustomBase] = useState<string>('');
  const [toCustomBase, setToCustomBase] = useState<string>('');

  const handleConverter = useCallback(() => {
    const effectiveFromBase = fromBase !== 'custom' ? fromBase : fromCustomBase || undefined;
    const effectiveToBase = toBase !== 'custom' ? toBase : toCustomBase || undefined;

    const { result, error } = convertNumbers(fromValue, effectiveFromBase, effectiveToBase, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, fromBase, toBase, fromCustomBase, toCustomBase, t]);

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
          SelectorComponent={BaseSelector}
          selectorProps={{ onCustomBaseChange: setFromCustomBase }}
          placeholder={t('numberConverter.fromPlaceholder') + ' ' + t('numberConverter.bulkInputHint')}
        />
      }
      right={
        <ConverterPanel
          type={SEARCH_PARAM_KEYS.TO}
          value={toValue}
          error={toError}
          SelectorComponent={BaseSelector}
          selectorProps={{ onCustomBaseChange: setToCustomBase }}
          readOnly
        />
      }
    />
  );
};
