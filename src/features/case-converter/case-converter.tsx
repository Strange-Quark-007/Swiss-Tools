'use client';

import { useCallback, useEffect } from 'react';

import { ConverterActions } from '@/components/app-converter/converter-actions';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { SplitView } from '@/components/content-layout/split-view';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import { useT } from '@/i18n/utils';
import { downloadFile } from '@/lib/download-file';

import { useCaseConverterStore } from './case-converter-store';
import { CaseSelector } from './case-selector';
import { CaseType, convertTextCase } from './utils';

interface Props {
  from: CaseType;
  to: CaseType;
}

export const CaseConverter = ({ from, to }: Props) => {
  const { t } = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();

  const { auto, fromValue, toValue, toError, setAuto, setFrom, setTo, setFromValue, setToValue, setToError, reset } =
    useCaseConverterStore();

  useUnmountEffect(reset);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useCallback(() => {
    const { result, error } = convertTextCase(fromValue, from, to, t);
    setToValue(result);
    setToError(error);
  }, [from, to, fromValue, setToValue, setToError, t]);

  useDebouncedEffect({ auto }, handleConvert, [from, to, fromValue, setToValue, setToError, t]);

  useEffect(() => {
    setFrom(from);
    setTo(to);
  }, [from, to, setFrom, setTo]);

  const handleSwap = () => {
    batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });

    setFromValue(toValue);
    setToValue(fromValue);
    setToError(undefined);
  };

  const handleSample = () => {
    setFromValue(
      'Lorem ipsum dolor 😎 sit amet, consectetur adipiscing elit!\n' +
        'Élève, façade, naïve, coöperate, café, résumé 💥\n' +
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua @#&* ~\n' +
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 🎯\n' +
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 🚀\n' +
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia ©®™\n' +
        'Fin de ligne! Voilà, test completed 😜 ~ñü'
    );
  };

  const handleClear = () => setFromValue('');
  const handleCopyFrom = () => fromValue && navigator.clipboard.writeText(fromValue);
  const handleCopyTo = () => toValue && navigator.clipboard.writeText(toValue);
  const handleDownload = () => downloadFile(toValue, 'output.txt', MIME_TYPE.TEXT);

  return (
    <>
      <input type="file" accept=".txt" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <SplitView
        left={
          <ConverterPanel
            type={SEARCH_PARAM_KEYS.FROM}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={CaseSelector}
            placeholder={t('caseConverter.fromPlaceholder') + ' ' + t('caseConverter.bulkInputHint')}
            onSample={handleSample}
            onClear={handleClear}
            onCopy={handleCopyFrom}
            onUpload={openFileDialog}
          />
        }
        center={
          <ConverterActions
            auto={auto}
            setAuto={setAuto}
            onConvert={handleConvert}
            onSwap={handleSwap}
            onReset={reset}
          />
        }
        right={
          <ConverterPanel
            readOnly
            type={SEARCH_PARAM_KEYS.TO}
            value={toValue}
            error={toError}
            SelectorComponent={CaseSelector}
            onCopy={handleCopyTo}
            onDownload={handleDownload}
          />
        }
      />
    </>
  );
};
