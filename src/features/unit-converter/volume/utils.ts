import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

export type VolumeType = ValueUnion<typeof VOLUMES>;

export const VOLUMES = {
  ml: { value: 'ml', label: 'Milliliter (ml)' },
  l: { value: 'l', label: 'Liter (l)' },
  fl_oz: { value: 'fl_oz', label: 'Fluid Ounce (fl oz)' },
  pt: { value: 'pt', label: 'Pint (pt)' },
  qt: { value: 'qt', label: 'Quart (qt)' },
  gal: { value: 'gal', label: 'Gallon (gal)' },
} as const;

export const conversionToMl: Record<VolumeType, UnitConversionConfig> = {
  ml: { scale: 1 },
  l: { scale: 1000 },
  fl_oz: { scale: 29.5735 },
  pt: { scale: 473.176 },
  qt: { scale: 946.353 },
  gal: { scale: 3785.41 },
};

export const { convert: convertVolume, bulkConvert: bulkConvertVolume } = createUnitConverter(conversionToMl);

