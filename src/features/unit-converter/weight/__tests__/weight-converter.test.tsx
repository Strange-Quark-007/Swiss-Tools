import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { bulkConvertWeight, WEIGHTS } from '../utils';
import { WeightConverter } from '../weight-converter';
import { useWeightConverterStore } from '../weight-converter-store';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('WeightConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<WeightConverter from={WEIGHTS.g.value} to={WEIGHTS.kg.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: WEIGHTS.g.value,
        to: WEIGHTS.kg.value,
        units: WEIGHTS,
        useStore: useWeightConverterStore,
        bulkConvert: bulkConvertWeight,
        placeholderKey: 'weightConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
