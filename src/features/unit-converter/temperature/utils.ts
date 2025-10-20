import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { exhaustiveCheck } from '@/lib/utils';
import { ConverterResult, ValueUnion } from '@/types/common';

export type TemperatureType = ValueUnion<typeof TEMPERATURES>;

export const TEMPERATURES = {
  c: { value: 'c', label: 'Celsius (°C)' },
  f: { value: 'f', label: 'Fahrenheit (°F)' },
  k: { value: 'k', label: 'Kelvin (K)' },
  r: { value: 'r', label: 'Rankine (°R)' },
} as const;

const convertTemperature = (
  fromText: string,
  from: TemperatureType,
  to: TemperatureType,
  t: TranslationFunction
): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const parsed = Number(fromText);

  if (!Number.isFinite(parsed)) {
    return { result: '', error: `${fromText} → ${t('label.invalidInput')}` };
  }

  let celsius: number = 0;

  switch (from) {
    case 'c':
      celsius = parsed;
      break;

    case 'f':
      celsius = (parsed - 32) * (5 / 9);
      break;

    case 'k':
      celsius = parsed - 273.15;
      break;

    case 'r':
      celsius = (parsed - 491.67) * (5 / 9);
      break;

    default:
      exhaustiveCheck(from);
  }

  let result: number = 0;

  switch (to) {
    case 'c':
      result = celsius;
      break;

    case 'f':
      result = celsius * (9 / 5) + 32;
      break;

    case 'k':
      result = celsius + 273.15;
      break;

    case 'r':
      result = (celsius + 273.15) * (9 / 5);
      break;

    default:
      exhaustiveCheck(to);
  }

  return {
    result: result.toFixed(3).replace(/\.?0+$/, ''),
  };
};

export const bulkConvertTemperature = (
  fromText: string,
  from: TemperatureType,
  to: TemperatureType,
  t: TranslationFunction
) => {
  return bulkProcessor({
    fromText,
    processor: convertTemperature,
    converterArgs: [from, to, t],
    bulkErrorTranslation: t('converter.bulkConverterWithErrors'),
  });
};
