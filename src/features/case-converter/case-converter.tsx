'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { CaseSelector } from './case-selector';
import { CaseType, convertTextCase } from './utils';

interface Props {
  from: CaseType;
  to: CaseType;
}

export const CaseConverter = ({ from, to }: Props) => {
  const t = useT();

  const [fromCase] = useUrlSearchParams<CaseType>(SEARCH_PARAM_KEYS.FROM, from);
  const [toCase] = useUrlSearchParams<CaseType>(SEARCH_PARAM_KEYS.TO, to);

  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);

  const handleConverter = useCallback(() => {
    const { result, error } = convertTextCase(fromValue, fromCase, toCase, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, fromCase, toCase, t]);

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
          SelectorComponent={CaseSelector}
          placeholder={t('caseConverter.fromPlaceholder') + ' ' + t('caseConverter.bulkInputHint')}
        />
      }
      right={
        <ConverterPanel
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
