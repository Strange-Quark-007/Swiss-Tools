import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

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
  nmi: { value: 'nmi', label: 'Nautical Mile (nmi)' },
} as const;

export const conversionToMeter: Record<LengthType, UnitConversionConfig> = {
  mm: { scale: 0.001 },
  cm: { scale: 0.01 },
  m: { scale: 1 },
  km: { scale: 1000 },
  in: { scale: 0.0254 },
  ft: { scale: 0.3048 },
  yd: { scale: 0.9144 },
  mi: { scale: 1609.344 },
  nmi: { scale: 1852 },
};

export const { convert: convertLength, bulkConvert: bulkConvertLength } = createUnitConverter(conversionToMeter);

