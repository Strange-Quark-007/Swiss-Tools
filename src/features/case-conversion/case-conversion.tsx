'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConversionPanel } from '@/components/app-conversion/conversion-panel';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { CaseSelector } from './case-selector';
import { CaseType, convertTextCase } from './utils';

interface Props {
  from: CaseType;
  to: CaseType;
}

export const CaseConversion = ({ from, to }: Props) => {
  const t = useT();

  const [fromCase] = useUrlSearchParams<CaseType>(SEARCH_PARAM_KEYS.FROM, from);
  const [toCase] = useUrlSearchParams<CaseType>(SEARCH_PARAM_KEYS.TO, to);

  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);

  const handleConversion = useCallback(() => {
    const { result, error } = convertTextCase(fromValue, fromCase, toCase, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, fromCase, toCase, t]);

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
          SelectorComponent={CaseSelector}
          placeholder={t('caseConversion.fromPlaceholder') + ' ' + t('caseConversion.bulkInputHint')}
        />
      }
      right={
        <ConversionPanel
          type={SEARCH_PARAM_KEYS.TO}
          value={toValue}
          error={toError}
          SelectorComponent={CaseSelector}
          readOnly
        />
      }
    />
  );
};
