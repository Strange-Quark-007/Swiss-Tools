import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { ConverterResult, ValueUnion } from '@/types/common';

export type SpeedType = ValueUnion<typeof SPEEDS>;

export const SPEEDS = {
  mps: { value: 'mps', label: 'Meters per Second (m/s)' },
  kph: { value: 'kph', label: 'Kilometers per Hour (km/h)' },
  mph: { value: 'mph', label: 'Miles per Hour (mi/h)' },
  fps: { value: 'fps', label: 'Feet per Second (ft/s)' },
  knot: { value: 'knot', label: 'Knot (kn)' },
} as const;

const conversionToMps: Record<keyof typeof SPEEDS, number> = {
  mps: 1,
  kph: 1 / 3.6,
  mph: 0.44704,
  fps: 0.3048,
  knot: 0.514444,
};

const convertArea = (fromText: string, from: SpeedType, to: SpeedType, t: TranslationFunction): ConverterResult => {
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

  const converted = (parsed * conversionToMps[from]) / conversionToMps[to];

  return {
    result: converted.toFixed(3).replace(/\.?0+$/, ''),
  };
};

export const bulkConvertArea = (fromText: string, from: SpeedType, to: SpeedType, t: TranslationFunction) => {
  return bulkProcessor({
    fromText,
    processor: convertArea,
    converterArgs: [from, to, t],
    bulkErrorTranslation: t('converter.bulkConverterWithErrors'),
  });
};
