import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { bulkConvertTime, convertTime, TIMES, TimeType } from '../utils';

describeUnitConverter<TimeType>({
  converterName: 'time',
  bulkConvert: bulkConvertTime,
  convert: convertTime,
  defaultUnits: {
    from: TIMES.s.value,
    to: TIMES.min.value,
  },
  testCases: [
    { from: 's', to: 'ms', input: '1', expected: '1000' },
    { from: 'ms', to: 's', input: '1000', expected: '1' },
    { from: 'min', to: 's', input: '1', expected: '60' },
    { from: 'h', to: 'min', input: '1', expected: '60' },
    { from: 'd', to: 'h', input: '1', expected: '24' },
    { from: 'wk', to: 'd', input: '1', expected: '7' },
    { from: 'mo', to: 'd', input: '1', expected: '30' },
    { from: 'yr', to: 'd', input: '1', expected: '360' },
  ],
});
