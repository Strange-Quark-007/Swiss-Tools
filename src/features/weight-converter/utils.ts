import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { ConverterResult, ValueUnion } from '@/types/common';

export type WeightType = ValueUnion<typeof WEIGHTS>;

export const WEIGHTS = {
  mg: { value: 'mg', label: 'Milligram (mg)' },
  g: { value: 'g', label: 'Gram (g)' },
  kg: { value: 'kg', label: 'Kilogram (kg)' },
  t: { value: 't', label: 'Tonne (t)' },
  oz: { value: 'oz', label: 'Ounce (oz)' },
  lb: { value: 'lb', label: 'Pound (lb)' },
  st: { value: 'st', label: 'Stone (st)' },
} as const;

const conversionToGram: Record<keyof typeof WEIGHTS, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  t: 1_000_000,
  oz: 28.3495,
  lb: 453.592,
  st: 6350.29,
};

const convertWeight = (
  fromText: string,
  fromWeight: WeightType,
  toWeight: WeightType,
  t: TranslationFunction
): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const parsed = Number(fromText);

  if (!Number.isFinite(parsed)) {
    return {
      result: '',
      error: `${fromText} → ${t('label.invalidInput')}`,
    };
  }

  const converted = (parsed * conversionToGram[fromWeight]) / conversionToGram[toWeight];

  return {
    result: converted.toFixed(6).replace(/\.?0+$/, ''),
  };
};

export const bulkConvertWeight = (
  fromText: string,
  fromWeight: WeightType,
  toWeight: WeightType,
  t: TranslationFunction
) => {
  return bulkProcessor({
    fromText,
    processor: convertWeight,
    converterArgs: [fromWeight, toWeight, t],
    bulkErrorTranslation: t('converter.bulkConverterWithErrors'),
  });
};
