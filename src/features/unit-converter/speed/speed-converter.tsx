'use client';

import { useSpeedConverterStore } from './speed-converter-store';
import { bulkConvertSpeed, SPEEDS, SpeedType } from './utils';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: SpeedType;
  to: SpeedType;
}

export const SpeedConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={SPEEDS}
      useStore={useSpeedConverterStore}
      bulkConvert={bulkConvertSpeed}
      placeholderKey="speedConverter.fromPlaceholder"
    />
  );
};
