import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { useAreaConverterStore } from '../area-converter-store';
import { AREAS, AreaType } from '../utils';

describeBaseConverterStore<AreaType>('useAreaConverterStore', {
  store: useAreaConverterStore,
  storageKey: ROUTES.AREA_CONVERTER.slice(1),
  defaultValues: {
    from: AREAS.sq_m.value,
    to: AREAS.sq_km.value,
  },
  sampleValues: {
    from: AREAS.sq_ft.value,
    to: AREAS.sq_in.value,
  },
});
