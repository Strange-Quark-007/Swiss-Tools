import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { useTemperatureConverterStore } from '../temperature-converter-store';
import { TEMPERATURES, TemperatureType } from '../utils';

describeBaseConverterStore<TemperatureType>('useTemperatureConverterStore', {
  store: useTemperatureConverterStore,
  storageKey: ROUTES.TEMPERATURE_CONVERTER.slice(1),
  defaultValues: {
    from: TEMPERATURES.c.value,
    to: TEMPERATURES.f.value,
  },
  sampleValues: {
    from: TEMPERATURES.k.value,
    to: TEMPERATURES.r.value,
  },
});
