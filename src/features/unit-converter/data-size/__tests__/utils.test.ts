import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { bulkConvertDataSize, convertDataSize, DATA_SIZES, DataSizeType } from '../utils';

describeUnitConverter<DataSizeType>({
  converterName: 'data-size',
  bulkConvert: bulkConvertDataSize,
  convert: convertDataSize,
  defaultUnits: {
    from: DATA_SIZES.mb.value,
    to: DATA_SIZES.gb.value,
  },
  testCases: [
    { from: 'b', to: 'bit', input: '1', expected: '8' },
    { from: 'bit', to: 'b', input: '8', expected: '1' },
    { from: 'kib', to: 'b', input: '1', expected: '1024' },
    { from: 'mib', to: 'kib', input: '1', expected: '1024' },
    { from: 'kb', to: 'b', input: '1', expected: '1000' },
    { from: 'mb', to: 'kb', input: '1', expected: '1000' },
    { from: 'gb', to: 'mb', input: '2.5', expected: '2500' },
    { from: 'gib', to: 'mib', input: '2', expected: '2048' },
  ],
});
