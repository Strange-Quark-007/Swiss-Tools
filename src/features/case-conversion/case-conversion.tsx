'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useT } from '@/i18n/utils';

import { ConversionPanel } from './conversion-panel';
import { CaseType, convertTextCase } from './utils';

interface Props {
  from: CaseType;
  to: CaseType;
}

export const CaseConversion = ({ from, to }: Props) => {
  const t = useT();

  const [fromCase] = useUrlSearchParams<CaseType>('from', from);
  const [toCase] = useUrlSearchParams<CaseType>('to', to);

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
          type="from"
          value={fromValue}
          onTextChange={setFromValue}
          placeholder={t('caseConversion.fromPlaceholder') + ' ' + t('caseConversion.bulkInputHint')}
        />
      }
      right={<ConversionPanel type="to" value={toValue} error={toError} onTextChange={() => {}} />}
    />
  );
};
