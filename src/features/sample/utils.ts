import { TranslationFunction } from '@/i18n/utils';
import { ConverterResult, ValueUnion } from '@/types/common';

export type SampleType = ValueUnion<typeof SAMPLE>;

export const SAMPLE = {
  sample: { value: 'sample', label: 'Sample' },
} as const;

export const convertSample = (
  fromText: string,
  _fromCase: SampleType | undefined,
  _toCase: SampleType | undefined,
  _t: TranslationFunction
): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  return { result: '' };
};
