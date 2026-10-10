import { createUnitConverter } from '@/features/unit-converter/shared/converter-engine';

import { describeUnitConverter } from '../unit-converter';

type DistanceUnit = 'm' | 'km';

const { convert, bulkConvert } = createUnitConverter<DistanceUnit>({
  m: { scale: 1 },
  km: { scale: 1000 },
});

describeUnitConverter<DistanceUnit>({
  converterName: 'distance test helper',
  convert,
  bulkConvert,
  defaultUnits: {
    from: 'km',
    to: 'm',
  },
  testCases: [
    { from: 'km', to: 'm', input: '1', expected: '1000' },
    { from: 'm', to: 'km', input: '500', expected: '0.5' },
  ],
});
