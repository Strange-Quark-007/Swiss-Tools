'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { ConverterActions } from '@/components/app-converter/converter-actions';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import HashAlgoSelector from './hash-algo-selector';
import { AlgoType, EncodingType, generateHash } from './util';

interface Props {
  algo: AlgoType;
  encoding: EncodingType;
}

export const HashGenerator = ({ algo, encoding }: Props) => {
  const t = useT();

  const [auto, setAuto] = useState(true);
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);

  const handleConvert = useCallback(async () => {
    const { result, error } = await generateHash(fromValue, algo, encoding, t);
    setToValue(result);
    setToError(error);
  }, [algo, encoding, fromValue, t]);

  useEffect(() => {
    if (!auto) {
      return;
    }
    const debouncedConvert = debounce(handleConvert, 300);
    debouncedConvert();
    return () => debouncedConvert.cancel();
  }, [auto, handleConvert]);

  const handleReset = () => {
    setFromValue('');
    setToValue('');
    setToError(undefined);
  };

  return (
    <SplitView
      left={
        <ConverterPanel
          type={SEARCH_PARAM_KEYS.ALGO}
          value={fromValue}
          onTextChange={setFromValue}
          SelectorComponent={HashAlgoSelector}
          placeholder={t('hashGenerator.fromPlaceholder')}
        />
      }
      center={<ConverterActions auto={auto} setAuto={setAuto} onConvert={handleConvert} onReset={handleReset} />}
      right={<ConverterPanel value={toValue} error={toError} readOnly />}
    />
  );
};
