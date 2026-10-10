import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { bulkConvertSpeed, convertSpeed, SPEEDS, SpeedType } from '../utils';

describeUnitConverter<SpeedType>({
  converterName: 'speed',
  bulkConvert: bulkConvertSpeed,
  convert: convertSpeed,
  defaultUnits: {
    from: SPEEDS.mps.value,
    to: SPEEDS.kph.value,
  },
  testCases: [
    { from: 'kph', to: 'mps', input: '3.6', expected: '1' },
    { from: 'mps', to: 'kph', input: '1', expected: '3.6' },
    { from: 'mph', to: 'kph', input: '1', expected: '1.609' },
    { from: 'fps', to: 'mps', input: '1', expected: '0.305' },
    { from: 'knot', to: 'kph', input: '1', expected: '1.852' },
    { from: 'mph', to: 'fps', input: '60', expected: '88' },
  ],
});
