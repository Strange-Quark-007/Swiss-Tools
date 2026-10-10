import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { bulkConvertVolume, VOLUMES } from '../utils';
import { VolumeConverter } from '../volume-converter';
import { useVolumeConverterStore } from '../volume-converter-store';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('VolumeConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<VolumeConverter from={VOLUMES.ml.value} to={VOLUMES.l.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: VOLUMES.ml.value,
        to: VOLUMES.l.value,
        units: VOLUMES,
        useStore: useVolumeConverterStore,
        bulkConvert: bulkConvertVolume,
        placeholderKey: 'volumeConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
