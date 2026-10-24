import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BaseUnitConverter } from '../../shared/base-unit-converter';
import { PowerConverter } from '../power-converter';
import { usePowerConverterStore } from '../power-converter-store';
import { bulkConvertPower, POWERS } from '../utils';

vi.mock('../../shared/base-unit-converter', () => ({
  BaseUnitConverter: vi.fn(() => null),
}));

describe('PowerConverter', () => {
  it('renders BaseUnitConverter with correct configuration', () => {
    render(<PowerConverter from={POWERS.kw.value} to={POWERS.hp.value} />);

    expect(BaseUnitConverter).toHaveBeenCalledWith(
      expect.objectContaining({
        from: POWERS.kw.value,
        to: POWERS.hp.value,
        units: POWERS,
        useStore: usePowerConverterStore,
        bulkConvert: bulkConvertPower,
        placeholderKey: 'powerConverter.fromPlaceholder',
      }),
      undefined
    );
  });
});
