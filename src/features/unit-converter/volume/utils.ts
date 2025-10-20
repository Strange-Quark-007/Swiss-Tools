import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { ConverterResult, ValueUnion } from '@/types/common';

export type VolumeType = ValueUnion<typeof VOLUMES>;

export const VOLUMES = {
  ml: { value: 'ml', label: 'Milliliter (ml)' },
  l: { value: 'l', label: 'Liter (l)' },
  fl_oz: { value: 'fl_oz', label: 'Fluid Ounce (fl oz)' },
  pt: { value: 'pt', label: 'Pint (pt)' },
  qt: { value: 'qt', label: 'Quart (qt)' },
  gal: { value: 'gal', label: 'Gallon (gal)' },
} as const;

const conversionToMl: Record<keyof typeof VOLUMES, number> = {
  ml: 1,
  l: 1000,
  fl_oz: 29.5735,
  pt: 473.176,
  qt: 946.353,
  gal: 3785.41,
};

const convertVolume = (fromText: string, from: VolumeType, to: VolumeType, t: TranslationFunction): ConverterResult => {
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

  const converted = (parsed * conversionToMl[from]) / conversionToMl[to];

  return {
    result: converted.toFixed(3).replace(/\.?0+$/, ''),
  };
};

export const bulkConvertVolume = (fromText: string, from: VolumeType, to: VolumeType, t: TranslationFunction) => {
  return bulkProcessor({
    fromText,
    processor: convertVolume,
    converterArgs: [from, to, t],
    bulkErrorTranslation: t('converter.bulkConverterWithErrors'),
  });
};
