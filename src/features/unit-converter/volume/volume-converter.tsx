'use client';

import { bulkConvertVolume, VOLUMES, VolumeType } from './utils';
import { useVolumeConverterStore } from './volume-converter-store';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: VolumeType;
  to: VolumeType;
}

export const VolumeConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={VOLUMES}
      useStore={useVolumeConverterStore}
      bulkConvert={bulkConvertVolume}
      placeholderKey="volumeConverter.fromPlaceholder"
    />
  );
};
