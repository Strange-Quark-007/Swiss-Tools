'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';

import { useT } from '@/i18n/utils';

import ConversionPanel from './conversion-panel';
import { BaseType, convertNumber } from './utils';

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
  const [fromCustomBase, setFromCustomBase] = useState<string>('');
  const [toCustomBase, setToCustomBase] = useState<string>('');

  const handleConversion = useCallback(() => {
    const effectiveFromBase = fromBase === 'custom' && fromCustomBase ? fromCustomBase : fromBase;
    const effectiveToBase = toBase === 'custom' && toCustomBase ? toCustomBase : toBase;

    const { result, error } = convertNumber(fromValue, effectiveFromBase, effectiveToBase, t);
    setToValue(error || result);
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
      />
      <ConversionPanel
        type="to"
        base={toBase}
        value={toValue}
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
