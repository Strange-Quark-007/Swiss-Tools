import { TranslationFunction } from '@/i18n/utils';
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

export const convertLength = (
  fromText: string,
  fromLength: LengthType,
  toLength: LengthType,
  t: TranslationFunction
): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const numbers = fromText
    .split(/[,\n]/)
    .map((num) => num.trim())
    .filter((num) => num !== '');

  if (numbers.length === 0) {
    return { result: '' };
  }

  const results: string[] = [];
  let hasError = false;

  for (const number of numbers) {
    const parsed = Number(number);
    if (!Number.isFinite(parsed)) {
      hasError = true;
      results.push(`${number} → ${t('label.invalidInput')}`);
      continue;
    }

    const converted = (parsed * conversionToMeter[fromLength]) / conversionToMeter[toLength];

    results.push(converted.toFixed(6).replace(/\.?0+$/, ''));
  }

  return {
    result: results.join('\n'),
    error: hasError ? t('lengthConverter.bulkConverterWithErrors') : undefined,
  };
};
