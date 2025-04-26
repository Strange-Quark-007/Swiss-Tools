'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';

import { useT } from '@/i18n/utils';

import ConversionPanel from './conversion-panel';
import { BaseType, convertNumbers } from './utils';

interface Props {
  from: BaseType;
  to: BaseType;
}

function NumberConversion({ from, to }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useT();

  const [fromBase, setFromBase] = useState<BaseType>(from);
  const [toBase, setToBase] = useState<BaseType>(to);
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);
  const [fromCustomBase, setFromCustomBase] = useState<string>('');
  const [toCustomBase, setToCustomBase] = useState<string>('');

  const handleConversion = useCallback(() => {
    const effectiveFromBase = fromBase !== 'custom' ? fromBase : fromCustomBase || undefined;
    const effectiveToBase = toBase !== 'custom' ? toBase : toCustomBase || undefined;

    if (!effectiveFromBase || !effectiveToBase) {
      return;
    }

    const { result, error } = convertNumbers(fromValue, effectiveFromBase, effectiveToBase, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, fromBase, toBase, fromCustomBase, toCustomBase, t]);

  useEffect(() => {
    const debouncedConversion = debounce(handleConversion, 300);
    debouncedConversion();
    return () => debouncedConversion.cancel();
  }, [handleConversion]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('from', fromBase);
    params.set('to', toBase);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [fromBase, toBase, router, searchParams]);

  return (
    <div className="grid grid-cols-2 gap-4 h-11/12 p-4">
      <ConversionPanel
        type="from"
        base={fromBase}
        value={fromValue}
        onSelectChange={(value) => {
          setFromBase(value);
          setFromCustomBase('');
        }}
        onTextChange={setFromValue}
        onCustomBaseChange={setFromCustomBase}
        placeholder={t('numberConversion.fromPlaceholder') + ' ' + t('numberConversion.bulkInputHint')}
      />
      <ConversionPanel
        type="to"
        base={toBase}
        value={toValue}
        error={toError}
        onSelectChange={(value) => {
          setToBase(value);
          setToCustomBase('');
        }}
        onTextChange={() => {}}
        onCustomBaseChange={setToCustomBase}
      />
    </div>
  );
}

export default NumberConversion;
