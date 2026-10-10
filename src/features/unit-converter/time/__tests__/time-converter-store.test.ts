import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { useTimeConverterStore } from '../time-converter-store';
import { TIMES, TimeType } from '../utils';

describeBaseConverterStore<TimeType>('useTimeConverterStore', {
  store: useTimeConverterStore,
  storageKey: ROUTES.TIME_CONVERTER.slice(1),
  defaultValues: {
    from: TIMES.s.value,
    to: TIMES.min.value,
  },
  sampleValues: {
    from: TIMES.h.value,
    to: TIMES.d.value,
  },
});
