import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { usePowerConverterStore } from '../power-converter-store';
import { POWERS, PowerType } from '../utils';

describeBaseConverterStore<PowerType>('usePowerConverterStore', {
  store: usePowerConverterStore,
  storageKey: ROUTES.POWER_CONVERTER.slice(1),
  defaultValues: {
    from: POWERS.kw.value,
    to: POWERS.hp.value,
  },
  sampleValues: {
    from: POWERS.w.value,
    to: POWERS.ps.value,
  },
});
