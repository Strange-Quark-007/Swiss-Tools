'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConversionPanel } from '@/components/app-conversion/conversion-panel';
import { useUrlSearchParams } from '@/hooks/use-search-params';
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

  const [toAlgo] = useUrlSearchParams<AlgoType>(SEARCH_PARAM_KEYS.ALGO, algo);
  const [toEncoding] = useUrlSearchParams<EncodingType>(SEARCH_PARAM_KEYS.ENCODING, encoding);

  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);

  const handleConversion = useCallback(async () => {
    const { result, error } = await generateHash(fromValue, toAlgo, toEncoding, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, toAlgo, toEncoding, t]);

  useEffect(() => {
    const debouncedConversion = debounce(handleConversion, 300);
    debouncedConversion();
    return () => debouncedConversion.cancel();
  }, [handleConversion]);

  return (
    <SplitView
      left={
        <ConversionPanel
          type={SEARCH_PARAM_KEYS.ALGO}
          value={fromValue}
          onTextChange={setFromValue}
          SelectorComponent={HashAlgoSelector}
          placeholder={t('hashGenerator.fromPlaceholder')}
        />
      }
      right={<ConversionPanel value={toValue} error={toError} readOnly />}
    />
  );
};
