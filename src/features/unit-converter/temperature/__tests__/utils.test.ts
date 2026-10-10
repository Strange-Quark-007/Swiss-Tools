import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { bulkConvertTemperature, convertTemperature, TEMPERATURES, TemperatureType } from '../utils';

describeUnitConverter<TemperatureType>({
  converterName: 'temperature',
  bulkConvert: bulkConvertTemperature,
  convert: convertTemperature,
  defaultUnits: {
    from: TEMPERATURES.c.value,
    to: TEMPERATURES.f.value,
  },
  testCases: [
    { from: 'c', to: 'f', input: '0', expected: '32' },
    { from: 'c', to: 'f', input: '100', expected: '212' },
    { from: 'f', to: 'c', input: '32', expected: '0' },
    { from: 'f', to: 'c', input: '98.6', expected: '37' },
    { from: 'c', to: 'k', input: '0', expected: '273.15' },
    { from: 'k', to: 'c', input: '0', expected: '-273.15' },
    { from: 'c', to: 'r', input: '0', expected: '491.67' },
    { from: 'r', to: 'k', input: '0', expected: '0' },
    { from: 'f', to: 'k', input: '32', expected: '273.15' },
  ],
});
