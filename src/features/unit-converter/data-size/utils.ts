import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

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

export const conversionToByte: Record<DataSizeType, UnitConversionConfig> = {
  bit: { scale: 1 / 8 },
  b: { scale: 1 },
  kib: { scale: 1024 },
  mib: { scale: 1024 ** 2 },
  gib: { scale: 1024 ** 3 },
  tib: { scale: 1024 ** 4 },
  pib: { scale: 1024 ** 5 },
  kb: { scale: 1000 },
  mb: { scale: 1000 ** 2 },
  gb: { scale: 1000 ** 3 },
  tb: { scale: 1000 ** 4 },
  pb: { scale: 1000 ** 5 },
};

export const { convert: convertDataSize, bulkConvert: bulkConvertDataSize } = createUnitConverter(conversionToByte);

