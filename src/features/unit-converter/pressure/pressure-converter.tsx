'use client';

import { usePressureConverterStore } from './pressure-converter-store';
import { bulkConvertPressure, PRESSURES, PressureType } from './utils';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: PressureType;
  to: PressureType;
}

export const PressureConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={PRESSURES}
      useStore={usePressureConverterStore}
      bulkConvert={bulkConvertPressure}
      placeholderKey="pressureConverter.fromPlaceholder"
    />
  );
};
