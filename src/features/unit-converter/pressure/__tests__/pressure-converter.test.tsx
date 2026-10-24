import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { PressureConverter } from '../pressure-converter';
import { usePressureConverterStore } from '../pressure-converter-store';
import { bulkConvertPressure, PRESSURES } from '../utils';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('PressureConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<PressureConverter from={PRESSURES.bar.value} to={PRESSURES.psi.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: PRESSURES.bar.value,
        to: PRESSURES.psi.value,
        units: PRESSURES,
        useStore: usePressureConverterStore,
        bulkConvert: bulkConvertPressure,
        placeholderKey: 'pressureConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
