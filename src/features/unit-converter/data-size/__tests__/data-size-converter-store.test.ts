import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { useDataSizeConverterStore } from '../data-size-converter-store';
import { DATA_SIZES, DataSizeType } from '../utils';

describeBaseConverterStore<DataSizeType>('useDataSizeConverterStore', {
  store: useDataSizeConverterStore,
  storageKey: ROUTES.DATA_SIZE_CONVERTER.slice(1),
  defaultValues: {
    from: DATA_SIZES.mb.value,
    to: DATA_SIZES.gb.value,
  },
  sampleValues: {
    from: DATA_SIZES.kib.value,
    to: DATA_SIZES.mib.value,
  },
});
