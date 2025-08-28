'use client';

import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

import { SplitView } from '@/components/content-layout/split-view';
import { ConversionPanel } from '@/components/app-conversion/conversion-panel';
import { useUrlSearchParams } from '@/hooks/use-search-params';
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

  const [baseCodec] = useUrlSearchParams(SEARCH_PARAM_KEYS.FROM, codec);
  const [baseMode] = useUrlSearchParams(SEARCH_PARAM_KEYS.TO, mode);

  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toError, setToError] = useState<string | undefined>(undefined);

  const handleConversion = useCallback(() => {
    const { result, error } = Transcode(fromValue, baseCodec, baseMode, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, baseCodec, baseMode, t]);

  useEffect(() => {
    const debouncedConversion = debounce(handleConversion, 300);
    debouncedConversion();
    return () => debouncedConversion.cancel();
  }, [handleConversion]);

  return (
    <SplitView
      left={
        <ConversionPanel
          type={SEARCH_PARAM_KEYS.CODEC}
          value={fromValue}
          onTextChange={setFromValue}
          SelectorComponent={CodecSelector}
          placeholder={t('encoderDecoder.fromPlaceholder', { mode: baseMode })}
        />
      }
      right={<ConversionPanel type={SEARCH_PARAM_KEYS.MODE} value={toValue} error={toError} readOnly />}
    />
  );
};
