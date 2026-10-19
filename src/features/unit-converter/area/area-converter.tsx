'use client';

import { useAreaConverterStore } from './area-converter-store';
import { AREAS, AreaType, bulkConvertArea } from './utils';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: AreaType;
  to: AreaType;
}

export const AreaConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={AREAS}
      useStore={useAreaConverterStore}
      bulkConvert={bulkConvertArea}
      placeholderKey="areaConverter.fromPlaceholder"
    />
  );
};
