'use client';

import { useTimeConverterStore } from './time-converter-store';
import { bulkConvertTime, TIMES, TimeType } from './utils';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: TimeType;
  to: TimeType;
}

export const TimeConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={TIMES}
      useStore={useTimeConverterStore}
      bulkConvert={bulkConvertTime}
      placeholderKey="timeConverter.fromPlaceholder"
    />
  );
};
