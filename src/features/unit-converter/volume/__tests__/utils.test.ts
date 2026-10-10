import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { bulkConvertVolume, convertVolume, VOLUMES, VolumeType } from '../utils';

describeUnitConverter<VolumeType>({
  converterName: 'volume',
  bulkConvert: bulkConvertVolume,
  convert: convertVolume,
  defaultUnits: {
    from: VOLUMES.ml.value,
    to: VOLUMES.l.value,
  },
  testCases: [
    { from: 'l', to: 'ml', input: '1', expected: '1000' },
    { from: 'ml', to: 'l', input: '1000', expected: '1' },
    { from: 'gal', to: 'l', input: '1', expected: '3.785' },
    { from: 'qt', to: 'ml', input: '1', expected: '946.353' },
    { from: 'pt', to: 'ml', input: '1', expected: '473.176' },
    { from: 'fl_oz', to: 'ml', input: '1', expected: '29.573' },
    { from: 'gal', to: 'qt', input: '1', expected: '4' },
  ],
});
