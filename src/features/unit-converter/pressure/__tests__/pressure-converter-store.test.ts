import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { usePressureConverterStore } from '../pressure-converter-store';
import { PRESSURES, PressureType } from '../utils';

describeBaseConverterStore<PressureType>('usePressureConverterStore', {
  store: usePressureConverterStore,
  storageKey: ROUTES.PRESSURE_CONVERTER.slice(1),
  defaultValues: {
    from: PRESSURES.bar.value,
    to: PRESSURES.psi.value,
  },
  sampleValues: {
    from: PRESSURES.kpa.value,
    to: PRESSURES.atm.value,
  },
});
