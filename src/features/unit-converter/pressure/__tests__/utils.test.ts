import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { bulkConvertPressure, convertPressure, PRESSURES, PressureType } from '../utils';

describeUnitConverter<PressureType>({
  converterName: 'pressure',
  bulkConvert: bulkConvertPressure,
  convert: convertPressure,
  defaultUnits: {
    from: PRESSURES.bar.value,
    to: PRESSURES.psi.value,
  },
  testCases: [
    { from: 'kpa', to: 'pa', input: '1', expected: '1000' },
    { from: 'bar', to: 'kpa', input: '1', expected: '100' },
    { from: 'bar', to: 'psi', input: '1', expected: '14.504' },
    { from: 'atm', to: 'kpa', input: '1', expected: '101.325' },
    { from: 'atm', to: 'torr', input: '1', expected: '760' },
    { from: 'mbar', to: 'pa', input: '1', expected: '100' },
    { from: 'inhg', to: 'kpa', input: '1', expected: '3.386' },
    { from: 'kgf_cm2', to: 'psi', input: '1', expected: '14.223' },
    { from: 'kgf_cm2', to: 'bar', input: '1', expected: '0.981' },
  ],
});
