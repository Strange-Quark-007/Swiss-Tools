import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { LengthConverter } from '../length-converter';
import { useLengthConverterStore } from '../length-converter-store';
import { bulkConvertLength, LENGTHS } from '../utils';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('LengthConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<LengthConverter from={LENGTHS.m.value} to={LENGTHS.km.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: LENGTHS.m.value,
        to: LENGTHS.km.value,
        units: LENGTHS,
        useStore: useLengthConverterStore,
        bulkConvert: bulkConvertLength,
        placeholderKey: 'lengthConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
