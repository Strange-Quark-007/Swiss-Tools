import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { ConverterResult, ValueUnion } from '@/types/common';

export type AreaType = ValueUnion<typeof AREAS>;

export const AREAS = {
  sq_mm: { value: 'sq_mm', label: 'Square Millimeter (mm²)' },
  sq_cm: { value: 'sq_cm', label: 'Square Centimeter (cm²)' },
  sq_m: { value: 'sq_m', label: 'Square Meter (m²)' },
  sq_km: { value: 'sq_km', label: 'Square Kilometer (km²)' },
  sq_in: { value: 'sq_in', label: 'Square Inch (in²)' },
  sq_ft: { value: 'sq_ft', label: 'Square Feet (ft²)' },
  sq_yd: { value: 'sq_yd', label: 'Square Yard (yd²)' },
  acre: { value: 'acre', label: 'Acre (ac)' },
  hectare: { value: 'hectare', label: 'Hectare (ha)' },
} as const;

const conversionToSqM: Record<keyof typeof AREAS, number> = {
  sq_mm: 1e-6,
  sq_cm: 0.0001,
  sq_m: 1,
  sq_km: 1e6,
  sq_in: 0.00064516,
  sq_ft: 0.092903,
  sq_yd: 0.836127,
  acre: 4046.8564224,
  hectare: 10000,
};

const convertArea = (fromText: string, from: AreaType, to: AreaType, t: TranslationFunction): ConverterResult => {
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

  const converted = (parsed * conversionToSqM[from]) / conversionToSqM[to];

  return {
    result: converted.toFixed(3).replace(/\.?0+$/, ''),
  };
};

export const bulkConvertArea = (fromText: string, from: AreaType, to: AreaType, t: TranslationFunction) => {
  return bulkProcessor({
    fromText,
    processor: convertArea,
    converterArgs: [from, to, t],
    bulkErrorTranslation: t('converter.bulkConverterWithErrors'),
  });
};
