import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { AreaConverter } from '../area-converter';
import { useAreaConverterStore } from '../area-converter-store';
import { AREAS, bulkConvertArea } from '../utils';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('AreaConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<AreaConverter from={AREAS.sq_m.value} to={AREAS.sq_km.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: AREAS.sq_m.value,
        to: AREAS.sq_km.value,
        units: AREAS,
        useStore: useAreaConverterStore,
        bulkConvert: bulkConvertArea,
        placeholderKey: 'areaConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
