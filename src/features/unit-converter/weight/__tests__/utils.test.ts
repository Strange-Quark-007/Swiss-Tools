import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { bulkConvertWeight, convertWeight, WEIGHTS, WeightType } from '../utils';

describeUnitConverter<WeightType>({
  converterName: 'weight',
  bulkConvert: bulkConvertWeight,
  convert: convertWeight,
  defaultUnits: {
    from: WEIGHTS.g.value,
    to: WEIGHTS.kg.value,
  },
  testCases: [
    { from: 'kg', to: 'g', input: '1', expected: '1000' },
    { from: 'g', to: 'mg', input: '1', expected: '1000' },
    { from: 't', to: 'kg', input: '1', expected: '1000' },
    { from: 'lb', to: 'g', input: '1', expected: '453.592' },
    { from: 'oz', to: 'g', input: '1', expected: '28.349' },
    { from: 'st', to: 'kg', input: '1', expected: '6.35' },
    { from: 'lb', to: 'oz', input: '1', expected: '16' },
  ],
});
