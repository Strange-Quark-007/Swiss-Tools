import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

export type PressureType = ValueUnion<typeof PRESSURES>;

export const PRESSURES = {
  pa: { value: 'pa', label: 'Pascal (Pa)' },
  kpa: { value: 'kpa', label: 'Kilopascal (kPa)' },
  mpa: { value: 'mpa', label: 'Megapascal (MPa)' },
  bar: { value: 'bar', label: 'Bar (bar)' },
  mbar: { value: 'mbar', label: 'Millibar (mbar)' },
  psi: { value: 'psi', label: 'Pound per Square Inch (psi)' },
  atm: { value: 'atm', label: 'Standard Atmosphere (atm)' },
  torr: { value: 'torr', label: 'Torr / mmHg (Torr)' },
  inhg: { value: 'inhg', label: 'Inch of Mercury (inHg)' },
  kgf_cm2: { value: 'kgf_cm2', label: 'Kilogram-force per Square Centimeter (kgf/cm²)' },
} as const;

export const conversionToPascal: Record<PressureType, UnitConversionConfig> = {
  pa: { scale: 1 },
  kpa: { scale: 1_000 },
  mpa: { scale: 1_000_000 },
  bar: { scale: 100_000 },
  mbar: { scale: 100 },
  psi: { scale: 6894.757293168 },
  atm: { scale: 101325 },
  torr: { scale: 101325 / 760 },
  inhg: { scale: 3386.3886666667 },
  kgf_cm2: { scale: 98066.5 },
};

export const { convert: convertPressure, bulkConvert: bulkConvertPressure } = createUnitConverter(conversionToPascal);
