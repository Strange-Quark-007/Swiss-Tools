import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { ConverterResult, ValueUnion } from '@/types/common';

export type DataSizeType = ValueUnion<typeof DATA_SIZES>;

export const DATA_SIZES = {
  bit: { value: 'bit', label: 'Bit (b)' },
  b: { value: 'b', label: 'Byte (B)' },
  kib: { value: 'kib', label: 'Kibibyte (KiB)' },
  mib: { value: 'mib', label: 'Mebibyte (MiB)' },
  gib: { value: 'gib', label: 'Gibibyte (GiB)' },
  tib: { value: 'tib', label: 'Tebibyte (TiB)' },
  pib: { value: 'pib', label: 'Pebibyte (PiB)' },
  kb: { value: 'kb', label: 'Kilobyte (KB)' },
  mb: { value: 'mb', label: 'Megabyte (MB)' },
  gb: { value: 'gb', label: 'Gigabyte (GB)' },
  tb: { value: 'tb', label: 'Terabyte (TB)' },
  pb: { value: 'pb', label: 'Petabyte (PB)' },
} as const;

const conversionToByte: Record<keyof typeof DATA_SIZES, number> = {
  bit: 1 / 8,
  b: 1,
  kib: 1024,
  mib: 1024 ** 2,
  gib: 1024 ** 3,
  tib: 1024 ** 4,
  pib: 1024 ** 5,
  kb: 1000,
  mb: 1000 ** 2,
  gb: 1000 ** 3,
  tb: 1000 ** 4,
  pb: 1000 ** 5,
};

const convertArea = (
  fromText: string,
  from: DataSizeType,
  to: DataSizeType,
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

  const converted = (parsed * conversionToByte[from]) / conversionToByte[to];

  return {
    result: converted.toFixed(3).replace(/\.?0+$/, ''),
  };
};

export const bulkConvertArea = (fromText: string, from: DataSizeType, to: DataSizeType, t: TranslationFunction) => {
  return bulkProcessor({
    fromText,
    processor: convertArea,
    converterArgs: [from, to, t],
    bulkErrorTranslation: t('converter.bulkConverterWithErrors'),
  });
};
