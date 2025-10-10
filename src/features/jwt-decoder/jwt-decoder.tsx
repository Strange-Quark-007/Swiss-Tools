'use client';

import { useEffectEvent } from 'react';

import { ConverterActions } from '@/components/app-converter/converter-actions';
import { SplitView } from '@/components/content-layout/split-view';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import { useT } from '@/i18n/utils';

import { useJwtDecoderStore } from './jwt-decoder-store';
import { JwtInput } from './jwt-input';
import { JwtOutput } from './jwt-output';
import { decodeJWT } from './utils';

export const JwtDecoder = () => {
  const { t } = useT();
  const { auto, input, setAuto, setHeader, setPayload, setError, reset } = useJwtDecoderStore();

  useUnmountEffect(reset);

  const handleConvert = useEffectEvent(async () => {
    const { result, error } = await decodeJWT(input, t);
    setHeader(result?.header);
    setPayload(result?.payload);
    setError(error);
  });

  useDebouncedEffect({ auto }, handleConvert, [input]);

  return (
    <SplitView
      left={<JwtInput />}
      center={<ConverterActions auto={auto} setAuto={setAuto} onConvert={handleConvert} onReset={reset} />}
      right={<JwtOutput />}
    />
  );
};
