import { useCallback, useEffect } from 'react';

import { ConverterActions } from '@/components/app-converter/converter-actions';
import { ConverterPanel } from '@/components/app-converter/converter-panel';
import { SplitView } from '@/components/content-layout/split-view';
import { MIME_TYPE, SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useBatchUrlSearchParams } from '@/hooks/use-search-params';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import { TranslationFunction, useT } from '@/i18n/utils';
import { BaseConverterState } from '@/types/base-state';
import { ConverterResult } from '@/types/common';
import { Option } from '@/types/selector';

import { BaseUnitSelector, BaseUnitSelectorOptions } from './base-unit-selector';

export interface BaseUnitConverterProps<T extends string> {
  from: T;
  to: T;
  units: Record<T, Option<T>>;
  useStore: () => BaseConverterState<T>;
  bulkConvert: (fromValue: string, from: T, to: T, t: TranslationFunction) => ConverterResult;
  placeholderKey: string;
}

export const BaseUnitConverter = <T extends string>({
  from,
  to,
  units,
  useStore,
  bulkConvert,
  placeholderKey,
}: BaseUnitConverterProps<T>) => {
  const { t } = useT();
  const batchSetSearchParams = useBatchUrlSearchParams();
  const downloadFile = useDownloadFile();

  const { auto, fromValue, toValue, toError, setAuto, setFrom, setTo, setFromValue, setToValue, setToError, reset } =
    useStore();

  useUnmountEffect(reset);

  const { fileInputRef, handleFileChange, openFileDialog } = useFileUpload(setFromValue, [MIME_TYPE.TEXT]);

  const handleConvert = useCallback(() => {
    const { result, error } = bulkConvert(fromValue, from, to, t);
    setToValue(result);
    setToError(error);
  }, [fromValue, from, to, t, bulkConvert, setToValue, setToError]);

  useDebouncedEffect({ auto }, handleConvert, [fromValue, from, to, t, bulkConvert, setToValue, setToError]);

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
    const randoms = Array.from({ length: 10 }, () => {
      const digits = Math.floor(Math.random() * 2) + 1;
      const min = 10 ** (digits - 1);
      const max = 10 ** digits - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });
    setFromValue(randoms.join('\n'));
  };

  const handleClear = () => setFromValue('');
  const handleCopyFrom = () => fromValue && navigator.clipboard.writeText(fromValue);
  const handleCopyTo = () => toValue && navigator.clipboard.writeText(toValue);
  const handleDownload = () => downloadFile(toValue, [to], MIME_TYPE.TEXT);

  const selectorProps: BaseUnitSelectorOptions<T> = { options: Object.values(units) };

  return (
    <>
      <input type="file" accept=".txt" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <SplitView
        left={
          <ConverterPanel<BaseUnitSelectorOptions<T>>
            type={SEARCH_PARAM_KEYS.FROM}
            value={fromValue}
            onTextChange={setFromValue}
            SelectorComponent={BaseUnitSelector}
            selectorProps={selectorProps}
            onSample={handleSample}
            onClear={handleClear}
            onCopy={handleCopyFrom}
            onUpload={openFileDialog}
            placeholder={t(placeholderKey, { from: units[from]?.label ?? from }) + '\n' + t('converter.bulkInputHint')}
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
          <ConverterPanel<BaseUnitSelectorOptions<T>>
            readOnly
            type={SEARCH_PARAM_KEYS.TO}
            value={toValue}
            error={toError}
            SelectorComponent={BaseUnitSelector}
            selectorProps={selectorProps}
            onCopy={handleCopyTo}
            onDownload={handleDownload}
          />
        }
      />
    </>
  );
};
