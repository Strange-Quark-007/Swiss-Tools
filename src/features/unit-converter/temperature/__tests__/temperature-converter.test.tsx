import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { TemperatureConverter } from '../temperature-converter';
import { useTemperatureConverterStore } from '../temperature-converter-store';
import { bulkConvertTemperature, TEMPERATURES } from '../utils';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('TemperatureConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<TemperatureConverter from={TEMPERATURES.c.value} to={TEMPERATURES.f.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: TEMPERATURES.c.value,
        to: TEMPERATURES.f.value,
        units: TEMPERATURES,
        useStore: useTemperatureConverterStore,
        bulkConvert: bulkConvertTemperature,
        placeholderKey: 'temperatureConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
