import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

export type SpeedType = ValueUnion<typeof SPEEDS>;

export const SPEEDS = {
  mps: { value: 'mps', label: 'Meters per Second (m/s)' },
  kph: { value: 'kph', label: 'Kilometers per Hour (km/h)' },
  mph: { value: 'mph', label: 'Miles per Hour (mi/h)' },
  fps: { value: 'fps', label: 'Feet per Second (ft/s)' },
  knot: { value: 'knot', label: 'Knot (kn)' },
} as const;

export const conversionToMps: Record<SpeedType, UnitConversionConfig> = {
  mps: { scale: 1 },
  kph: { scale: 1 / 3.6 },
  mph: { scale: 0.44704 },
  fps: { scale: 0.3048 },
  knot: { scale: 0.514444 },
};

export const { convert: convertSpeed, bulkConvert: bulkConvertSpeed } = createUnitConverter(conversionToMps);

