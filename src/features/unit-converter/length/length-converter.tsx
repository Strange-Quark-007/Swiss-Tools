'use client';

import { useLengthConverterStore } from './length-converter-store';
import { bulkConvertLength, LENGTHS, LengthType } from './utils';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: LengthType;
  to: LengthType;
}

export const LengthConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={LENGTHS}
      useStore={useLengthConverterStore}
      bulkConvert={bulkConvertLength}
      placeholderKey="lengthConverter.fromPlaceholder"
    />
  );
};
