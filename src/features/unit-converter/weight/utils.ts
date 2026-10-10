import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

export type WeightType = ValueUnion<typeof WEIGHTS>;

export const WEIGHTS = {
  mg: { value: 'mg', label: 'Milligram (mg)' },
  g: { value: 'g', label: 'Gram (g)' },
  kg: { value: 'kg', label: 'Kilogram (kg)' },
  t: { value: 't', label: 'Tonne (t)' },
  oz: { value: 'oz', label: 'Ounce (oz)' },
  lb: { value: 'lb', label: 'Pound (lb)' },
  st: { value: 'st', label: 'Stone (st)' },
} as const;

export const conversionToGram: Record<WeightType, UnitConversionConfig> = {
  mg: { scale: 0.001 },
  g: { scale: 1 },
  kg: { scale: 1000 },
  t: { scale: 1_000_000 },
  oz: { scale: 28.3495 },
  lb: { scale: 453.592 },
  st: { scale: 6350.29 },
};

export const { convert: convertWeight, bulkConvert: bulkConvertWeight } = createUnitConverter(conversionToGram);

