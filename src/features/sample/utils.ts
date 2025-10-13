import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { ConverterResult, ValueUnion } from '@/types/common';

export type SampleType = ValueUnion<typeof SAMPLE>;

export const SAMPLE = {
  sample: { value: 'sample', label: 'Sample' },
} as const;

const convertSample = (
  fromText: string,
  _from: SampleType | undefined,
  _to: SampleType | undefined,
  _t: TranslationFunction
): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  return { result: '' };
};

export const bulkConvertSample = (
  fromText: string,
  _from: SampleType | undefined,
  _to: SampleType | undefined,
  _t: TranslationFunction
): ConverterResult => {
  return bulkProcessor({ fromText, processor: convertSample, converterArgs: [_from, _to, _t] });
};
