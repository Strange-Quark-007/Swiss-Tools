import { TOOLTIP_TYPE } from '@/constants/common';
import { ValueUnion } from '@/types/common';

import { createUnitConverter, UnitConversionConfig } from '../shared/converter-engine';

export type TimeType = ValueUnion<typeof TIMES>;

export const TIMES = {
  ms: { value: 'ms', label: 'Millisecond (ms)' },
  s: { value: 's', label: 'Second (s)' },
  min: { value: 'min', label: 'Minute (min)' },
  h: { value: 'h', label: 'Hour (h)' },
  d: { value: 'd', label: 'Day (d)' },
  wk: { value: 'wk', label: 'Week (wk)' },
  mo: {
    value: 'mo',
    label: 'Month (mo)',
    tooltip: { type: TOOLTIP_TYPE.info, messageKey: 'timeConverter.monthTooltip' },
  },
  yr: {
    value: 'yr',
    label: 'Year (yr)',
    tooltip: {
      type: TOOLTIP_TYPE.info,
      messageKey: 'timeConverter.yearTooltip',
    },
  },
} as const;

export const conversionToSecond: Record<TimeType, UnitConversionConfig> = {
  ms: { scale: 0.001 },
  s: { scale: 1 },
  min: { scale: 60 },
  h: { scale: 3600 },
  d: { scale: 86400 },
  wk: { scale: 604800 },
  mo: { scale: 2592000 },
  yr: { scale: 31104000 },
};

export const { convert: convertTime, bulkConvert: bulkConvertTime } = createUnitConverter(conversionToSecond);

