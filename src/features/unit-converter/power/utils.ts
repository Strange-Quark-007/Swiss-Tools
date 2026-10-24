import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

export type PowerType = ValueUnion<typeof POWERS>;

export const POWERS = {
  w: { value: 'w', label: 'Watt (W)' },
  kw: { value: 'kw', label: 'Kilowatt (kW)' },
  mw: { value: 'mw', label: 'Megawatt (MW)' },
  gw: { value: 'gw', label: 'Gigawatt (GW)' },
  milliw: { value: 'milliw', label: 'Milliwatt (mW)' },
  hp: { value: 'hp', label: 'Horsepower (hp)' },
  ps: { value: 'ps', label: 'Metric Horsepower (PS)' },
  btu_h: { value: 'btu_h', label: 'BTU per Hour (BTU/h)' },
  ft_lb_s: { value: 'ft_lb_s', label: 'Foot-Pound per Second (ft⋅lb/s)' },
} as const;

export const conversionToWatt: Record<PowerType, UnitConversionConfig> = {
  w: { scale: 1 },
  kw: { scale: 1_000 },
  mw: { scale: 1_000_000 },
  gw: { scale: 1_000_000_000 },
  milliw: { scale: 0.001 },
  hp: { scale: 745.69987158 },
  ps: { scale: 735.49875 },
  btu_h: { scale: 0.29307107 },
  ft_lb_s: { scale: 1.35581795 },
};

export const { convert: convertPower, bulkConvert: bulkConvertPower } = createUnitConverter(conversionToWatt);
