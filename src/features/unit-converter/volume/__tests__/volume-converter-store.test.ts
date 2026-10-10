import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { VOLUMES, VolumeType } from '../utils';
import { useVolumeConverterStore } from '../volume-converter-store';

describeBaseConverterStore<VolumeType>('useVolumeConverterStore', {
  store: useVolumeConverterStore,
  storageKey: ROUTES.VOLUME_CONVERTER.slice(1),
  defaultValues: {
    from: VOLUMES.ml.value,
    to: VOLUMES.l.value,
  },
  sampleValues: {
    from: VOLUMES.fl_oz.value,
    to: VOLUMES.gal.value,
  },
});
