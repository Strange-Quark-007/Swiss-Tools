'use client';
import { useEffect, useEffectEvent } from 'react';

import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';
import { downloadFile } from '@/lib/download-file';

import { useIdGeneratorStore } from './id-generator-store';
import { IdSelector } from './id-selector';
import { generateIDs, IDType } from './utils';

interface Props {
  type: IDType;
}

export const IdGenerator = ({ type }: Props) => {
  const { t: _t } = useT();
  const { type: stateType, count, toValue, toError, setType, setToValue, setToError } = useIdGeneratorStore();

  const handleConvert = useEffectEvent(async () => {
    const { result, error } = await generateIDs(type, count);
    setToValue(result);
    setToError(error);
  });

  useEffect(() => {
    if (stateType !== type) {
      setType(type);
      handleConvert();
    }
    if (!toValue) {
      handleConvert();
    }
  }, [type, stateType, toValue, setType, handleConvert]);

  const handleCopy = () => toValue && navigator.clipboard.writeText(toValue);
  const handleDownload = () => downloadFile(toValue, 'ids.txt', MIME_TYPE.TEXT);

  return (
    <ConverterPanel
      readOnly
      value={toValue}
      error={toError}
      className="justify-start"
      textareaClassName="max-h-[65vh] sm:max-h-[70vh] break-normal"
      type={SEARCH_PARAM_KEYS.TYPE}
      SelectorComponent={IdSelector}
      selectorProps={{ onGenerateNew: handleConvert }}
      onDownload={handleDownload}
      onCopy={handleCopy}
    />
  );
};
