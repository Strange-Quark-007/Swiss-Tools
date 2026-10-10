import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { AREAS, AreaType, bulkConvertArea, convertArea } from '../utils';

describeUnitConverter<AreaType>({
  converterName: 'area',
  bulkConvert: bulkConvertArea,
  convert: convertArea,
  defaultUnits: {
    from: AREAS.sq_m.value,
    to: AREAS.sq_km.value,
  },
  testCases: [
    { from: 'sq_m', to: 'sq_km', input: '1000000', expected: '1' },
    { from: 'sq_km', to: 'sq_m', input: '2.5', expected: '2500000' },
    { from: 'sq_m', to: 'sq_cm', input: '1', expected: '10000' },
    { from: 'sq_cm', to: 'sq_mm', input: '1', expected: '100' },
    { from: 'hectare', to: 'sq_m', input: '1', expected: '10000' },
    { from: 'acre', to: 'sq_m', input: '1', expected: '4046.856' },
    { from: 'sq_yd', to: 'sq_ft', input: '1', expected: '9' },
    { from: 'sq_ft', to: 'sq_in', input: '1', expected: '144' },
  ],
});
