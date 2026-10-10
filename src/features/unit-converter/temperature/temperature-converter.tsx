'use client';

import { useTemperatureConverterStore } from './temperature-converter-store';
import { bulkConvertTemperature, TEMPERATURES, TemperatureType } from './utils';
import { BaseUnitConverter } from '../shared/base-unit-converter';

interface Props {
  from: TemperatureType;
  to: TemperatureType;
}

export const TemperatureConverter = ({ from, to }: Props) => {
  return (
    <BaseUnitConverter
      from={from}
      to={to}
      units={TEMPERATURES}
      useStore={useTemperatureConverterStore}
      bulkConvert={bulkConvertTemperature}
      placeholderKey="temperatureConverter.fromPlaceholder"
    />
  );
};
