import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

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

export const conversionToSqM: Record<AreaType, UnitConversionConfig> = {
  sq_mm: { scale: 1e-6 },
  sq_cm: { scale: 0.0001 },
  sq_m: { scale: 1 },
  sq_km: { scale: 1e6 },
  sq_in: { scale: 0.00064516 },
  sq_ft: { scale: 0.092903 },
  sq_yd: { scale: 0.836127 },
  acre: { scale: 4046.8564224 },
  hectare: { scale: 10000 },
};

export const { convert: convertArea, bulkConvert: bulkConvertArea } = createUnitConverter(conversionToSqM);

