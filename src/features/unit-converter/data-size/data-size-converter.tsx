'use client';

import { useDataSizeConverterStore } from './data-size-converter-store';
import { bulkConvertDataSize, DATA_SIZES, DataSizeType } from './utils';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: DataSizeType;
  to: DataSizeType;
}

export const DataSizeConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={DATA_SIZES}
      useStore={useDataSizeConverterStore}
      bulkConvert={bulkConvertDataSize}
      placeholderKey="dataSizeConverter.fromPlaceholder"
    />
  );
};
