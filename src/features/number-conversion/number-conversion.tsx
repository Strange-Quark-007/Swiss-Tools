'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useT } from '@/i18n/utils';

import { ConversionPanel } from './conversion-panel';
import { BaseType, convertNumbers } from './utils';

interface Props {
  from: BaseType;
  to: BaseType;
}

export const NumberConversion = ({ from, to }: Props) => {
  const t = useT();

  const { value: fromBase } = useUrlSearchParams<BaseType>('from', from);
  const { value: toBase } = useUrlSearchParams<BaseType>('to', to);

  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);
  const [fromCustomBase, setFromCustomBase] = useState<string>('');
  const [toCustomBase, setToCustomBase] = useState<string>('');

  const handleConversion = useCallback(() => {
    const effectiveFromBase = fromBase !== 'custom' ? fromBase : fromCustomBase || undefined;
    const effectiveToBase = toBase !== 'custom' ? toBase : toCustomBase || undefined;

    const { result, error } = convertNumbers(fromValue, effectiveFromBase, effectiveToBase, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, fromBase, toBase, fromCustomBase, toCustomBase, t]);

  useEffect(() => {
    const debouncedConversion = debounce(handleConversion, 300);
    debouncedConversion();
    return () => debouncedConversion.cancel();
  }, [handleConversion]);

  return (
    <SplitView
      left={
        <ConversionPanel
          type="from"
          value={fromValue}
          onTextChange={setFromValue}
          onCustomBaseChange={setFromCustomBase}
          placeholder={t('numberConversion.fromPlaceholder') + ' ' + t('numberConversion.bulkInputHint')}
        />
      }
      right={
        <ConversionPanel
          type="to"
          value={toValue}
          error={toError}
          onTextChange={() => {}}
          onCustomBaseChange={setToCustomBase}
        />
      }
    />
  );
};
