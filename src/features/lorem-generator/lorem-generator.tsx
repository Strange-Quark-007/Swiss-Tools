'use client';
import { useCallback, useEffect } from 'react';

import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { GA_EVENTS } from '@/constants/gaEvents';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useTrackEvent } from '@/hooks/use-ga-events';
import { useT } from '@/i18n/utils';

import { useLoremGeneratorStore } from './lorem-generator-store';
import { LoremSelector } from './lorem-selector';
import { generateLorem, LoremType } from './utils';

interface Props {
  type: LoremType;
}

export const LoremGenerator = ({ type }: Props) => {
  const { t: t } = useT();
  const trackEvent = useTrackEvent();
  const downloadFile = useDownloadFile();
  const { type: stateType, count, toValue, toError, setType, setToValue, setToError } = useLoremGeneratorStore();

  const handleConvert = useCallback(() => {
    const { result, error } = generateLorem(type, count, t);
    setToValue(result);
    setToError(error);
  }, [type, count, t, setToValue, setToError]);

  useEffect(() => {
    if (stateType !== type) {
      setType(type);
      handleConvert();
      trackEvent(GA_EVENTS.GENERATE);
    }
    if (!toValue) {
      handleConvert();
      trackEvent(GA_EVENTS.GENERATE);
    }
  }, [type, stateType, toValue, setType, handleConvert, trackEvent]);

  const handleCopy = () => toValue && navigator.clipboard.writeText(toValue);
  const handleDownload = () => downloadFile(toValue, [type], MIME_TYPE.TEXT);

  return (
    <ConverterPanel
      readOnly
      value={toValue}
      error={toError}
      className="justify-start"
      textareaClassName="max-h-[74vh] sm:max-h-[79.5vh] break-normal"
      type={SEARCH_PARAM_KEYS.TYPE}
      SelectorComponent={LoremSelector}
      selectorProps={{ onGenerateNew: handleConvert }}
      onDownload={handleDownload}
      onCopy={handleCopy}
    />
  );
};
