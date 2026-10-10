import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

export type TemperatureType = ValueUnion<typeof TEMPERATURES>;

export const TEMPERATURES = {
  c: { value: 'c', label: 'Celsius (°C)' },
  f: { value: 'f', label: 'Fahrenheit (°F)' },
  k: { value: 'k', label: 'Kelvin (K)' },
  r: { value: 'r', label: 'Rankine (°R)' },
} as const;

export const conversionToCelsius: Record<TemperatureType, UnitConversionConfig> = {
  c: { scale: 1, offset: 0 },
  f: { scale: 5 / 9, offset: -32 },
  k: { scale: 1, offset: -273.15 },
  r: { scale: 5 / 9, offset: -491.67 },
};

export const { convert: convertTemperature, bulkConvert: bulkConvertTemperature } =
  createUnitConverter(conversionToCelsius);

