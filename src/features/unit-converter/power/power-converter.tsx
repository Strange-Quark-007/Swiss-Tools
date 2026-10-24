'use client';

import { usePowerConverterStore } from './power-converter-store';
import { bulkConvertPower, POWERS, PowerType } from './utils';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: PowerType;
  to: PowerType;
}

export const PowerConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={POWERS}
      useStore={usePowerConverterStore}
      bulkConvert={bulkConvertPower}
      placeholderKey="powerConverter.fromPlaceholder"
    />
  );
};
