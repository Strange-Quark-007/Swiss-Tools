import { describeUnitConverter } from '@/test-helpers/unit-converter';

import { bulkConvertPower, convertPower, POWERS, PowerType } from '../utils';

describeUnitConverter<PowerType>({
  converterName: 'power',
  bulkConvert: bulkConvertPower,
  convert: convertPower,
  defaultUnits: {
    from: POWERS.kw.value,
    to: POWERS.hp.value,
  },
  testCases: [
    { from: 'kw', to: 'w', input: '1', expected: '1000' },
    { from: 'mw', to: 'kw', input: '1', expected: '1000' },
    { from: 'gw', to: 'mw', input: '1', expected: '1000' },
    { from: 'milliw', to: 'w', input: '1000', expected: '1' },
    { from: 'hp', to: 'w', input: '1', expected: '745.7' },
    { from: 'hp', to: 'kw', input: '1', expected: '0.746' },
    { from: 'ps', to: 'w', input: '1', expected: '735.499' },
    { from: 'kw', to: 'hp', input: '1', expected: '1.341' },
    { from: 'kw', to: 'ps', input: '1', expected: '1.36' },
    { from: 'btu_h', to: 'w', input: '1', expected: '0.293' },
    { from: 'ft_lb_s', to: 'w', input: '1', expected: '1.356' },
  ],
});
