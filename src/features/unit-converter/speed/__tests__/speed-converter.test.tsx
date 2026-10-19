import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { SpeedConverter } from '../speed-converter';
import { useSpeedConverterStore } from '../speed-converter-store';
import { bulkConvertSpeed, SPEEDS } from '../utils';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('SpeedConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<SpeedConverter from={SPEEDS.mps.value} to={SPEEDS.kph.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: SPEEDS.mps.value,
        to: SPEEDS.kph.value,
        units: SPEEDS,
        useStore: useSpeedConverterStore,
        bulkConvert: bulkConvertSpeed,
        placeholderKey: 'speedConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
