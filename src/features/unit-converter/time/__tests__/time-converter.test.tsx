import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { TimeConverter } from '../time-converter';
import { useTimeConverterStore } from '../time-converter-store';
import { bulkConvertTime, TIMES } from '../utils';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('TimeConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<TimeConverter from={TIMES.s.value} to={TIMES.min.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: TIMES.s.value,
        to: TIMES.min.value,
        units: TIMES,
        useStore: useTimeConverterStore,
        bulkConvert: bulkConvertTime,
        placeholderKey: 'timeConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
