import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { ConverterResult } from '@/types/common';

export interface UnitConversionConfig {
  scale: number;
  offset?: number;
}

export const convertUnitValue = (
  value: number,
  fromConfig: UnitConversionConfig,
  toConfig: UnitConversionConfig
): number => {
  const fromOffset = fromConfig.offset ?? 0;
  const toOffset = toConfig.offset ?? 0;

  const baseValue = (value + fromOffset) * fromConfig.scale;
  const converted = baseValue / toConfig.scale - toOffset;

  return Math.abs(converted) < 1e-12 ? 0 : converted;
};

export const formatConvertedValue = (value: number, precision = 3): string => {
  return value.toFixed(precision).replace(/\.?0+$/, '');
};

export const createUnitConverter = <T extends string>(conversionTable: Record<T, UnitConversionConfig>) => {
  const convert = (fromText: string, from: T, to: T, t: TranslationFunction): ConverterResult => {
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

    const converted = convertUnitValue(parsed, conversionTable[from], conversionTable[to]);

    return {
      result: formatConvertedValue(converted),
    };
  };

  const bulkConvert = (fromText: string, from: T, to: T, t: TranslationFunction) => {
    return bulkProcessor({
      fromText,
      processor: convert,
      converterArgs: [from, to, t],
      bulkErrorTranslation: t('converter.bulkConverterWithErrors'),
    });
  };

  return { convert, bulkConvert };
};
