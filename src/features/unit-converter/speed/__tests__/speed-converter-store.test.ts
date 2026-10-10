import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { useSpeedConverterStore } from '../speed-converter-store';
import { SPEEDS, SpeedType } from '../utils';

describeBaseConverterStore<SpeedType>('useSpeedConverterStore', {
  store: useSpeedConverterStore,
  storageKey: ROUTES.SPEED_CONVERTER.slice(1),
  defaultValues: {
    from: SPEEDS.mps.value,
    to: SPEEDS.kph.value,
  },
  sampleValues: {
    from: SPEEDS.mph.value,
    to: SPEEDS.knot.value,
  },
});
