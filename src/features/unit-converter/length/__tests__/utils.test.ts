import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { bulkConvertLength, convertLength, LENGTHS, LengthType } from '../utils';

describeUnitConverter<LengthType>({
  converterName: 'length',
  bulkConvert: bulkConvertLength,
  convert: convertLength,
  defaultUnits: {
    from: LENGTHS.m.value,
    to: LENGTHS.km.value,
  },
  testCases: [
    { from: 'm', to: 'km', input: '1000', expected: '1' },
    { from: 'km', to: 'm', input: '2.5', expected: '2500' },
    { from: 'cm', to: 'mm', input: '10', expected: '100' },
    { from: 'in', to: 'cm', input: '1', expected: '2.54' },
    { from: 'ft', to: 'in', input: '2', expected: '24' },
    { from: 'yd', to: 'ft', input: '3', expected: '9' },
    { from: 'mi', to: 'km', input: '1', expected: '1.609' },
    { from: 'nmi', to: 'm', input: '1', expected: '1852' },
  ],
});
