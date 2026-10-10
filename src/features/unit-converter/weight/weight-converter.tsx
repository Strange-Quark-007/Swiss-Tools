'use client';

import { bulkConvertWeight, WEIGHTS, WeightType } from './utils';
import { useWeightConverterStore } from './weight-converter-store';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: WeightType;
  to: WeightType;
}

export const WeightConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={WEIGHTS}
      useStore={useWeightConverterStore}
      bulkConvert={bulkConvertWeight}
      placeholderKey="weightConverter.fromPlaceholder"
    />
  );
};
