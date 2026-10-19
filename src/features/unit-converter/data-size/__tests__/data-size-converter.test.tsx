import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { DataSizeConverter } from '../data-size-converter';
import { useDataSizeConverterStore } from '../data-size-converter-store';
import { bulkConvertDataSize, DATA_SIZES } from '../utils';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('DataSizeConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<DataSizeConverter from={DATA_SIZES.b.value} to={DATA_SIZES.kb.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: DATA_SIZES.b.value,
        to: DATA_SIZES.kb.value,
        units: DATA_SIZES,
        useStore: useDataSizeConverterStore,
        bulkConvert: bulkConvertDataSize,
        placeholderKey: 'dataSizeConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
