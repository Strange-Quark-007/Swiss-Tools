import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { ConverterResult, ValueUnion } from '@/types/common';

export type LengthType = ValueUnion<typeof LENGTHS>;

export const LENGTHS = {
  mm: { value: 'mm', label: 'Millimeter (mm)' },
  cm: { value: 'cm', label: 'Centimeter (cm)' },
  m: { value: 'm', label: 'Meter (m)' },
  km: { value: 'km', label: 'Kilometer (km)' },
  in: { value: 'in', label: 'Inch (in)' },
  ft: { value: 'ft', label: 'Feet (ft)' },
  yd: { value: 'yd', label: 'Yard (yd)' },
  mi: { value: 'mi', label: 'Mile (mi)' },
} as const;

const conversionToMeter: Record<LengthType, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const convertLength = (
  fromText: string,
  fromLength: LengthType,
  toLength: LengthType,
  t: TranslationFunction
): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const parsed = Number(fromText);
  console.log(fromText, parsed);
  if (!Number.isFinite(parsed)) {
    return {
      result: '',
      error: `${fromText} → ${t('label.invalidInput')}`,
    };
  }

  const converted = (parsed * conversionToMeter[fromLength]) / conversionToMeter[toLength];

  return {
    result: converted.toFixed(6).replace(/\.?0+$/, ''),
  };
};

export const bulkConvertLength = (
  fromText: string,
  fromLength: LengthType,
  toLength: LengthType,
  t: TranslationFunction
) => {
  return bulkProcessor({
    fromText,
    processor: convertLength,
    converterArgs: [fromLength, toLength, t],
    bulkErrorTranslation: t('lengthConverter.bulkConverterWithErrors'),
  });
};
