'use client';
import { useCallback, useEffect } from 'react';

import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';
import { downloadFile } from '@/lib/download-file';

import { useLoremGeneratorStore } from './lorem-generator-store';
import { LoremSelector } from './lorem-selector';
import { generateLorem, LoremType } from './utils';

interface Props {
  type: LoremType;
}

export const LoremGenerator = ({ type }: Props) => {
  const { t: _t } = useT();
  const { type: stateType, count, toValue, setType, setToValue } = useLoremGeneratorStore();

  const handleConvert = useCallback(() => {
    const { result } = generateLorem(type, count);
    setToValue(result);
  }, [type, count, setToValue]);

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
  const handleDownload = () => downloadFile(toValue, 'lorem.txt', MIME_TYPE.TEXT);

  return (
    <ConverterPanel
      readOnly
      value={toValue}
      className="justify-start"
      textareaClassName="max-h-[65vh] sm:max-h-[70vh] break-normal"
      type={SEARCH_PARAM_KEYS.TYPE}
      SelectorComponent={LoremSelector}
      selectorProps={{ onGenerateNew: handleConvert }}
      onDownload={handleDownload}
      onCopy={handleCopy}
    />
  );
};
