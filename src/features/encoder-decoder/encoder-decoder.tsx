'use client';

import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { CodecType, ModeType, Transcode } from './utils';
import { CodecSelector } from './codec-selector';

interface Props {
  codec: CodecType;
  mode: ModeType;
}

export const EncoderDecoder = ({ codec, mode }: Props) => {
  const t = useT();

  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);

  const handleConvert = useCallback(() => {
    const { result, error } = Transcode(fromValue, codec, mode, t);
    setToValue(result);
    setToError(error);
  }, [codec, mode, fromValue, t]);

  useEffect(() => {
    const debouncedConvert = debounce(handleConvert, 300);
    debouncedConvert();
    return () => debouncedConvert.cancel();
  }, [handleConvert]);

  return (
    <SplitView
      left={
        <ConverterPanel
          type={SEARCH_PARAM_KEYS.CODEC}
          value={fromValue}
          onTextChange={setFromValue}
          SelectorComponent={CodecSelector}
          placeholder={t('encoderDecoder.fromPlaceholder', { mode })}
        />
      }
      right={<ConverterPanel value={toValue} error={toError} readOnly />}
    />
  );
};
