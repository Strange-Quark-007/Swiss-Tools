import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { useLengthConverterStore } from '../length-converter-store';
import { LENGTHS, LengthType } from '../utils';

describeBaseConverterStore<LengthType>('useLengthConverterStore', {
  store: useLengthConverterStore,
  storageKey: ROUTES.LENGTH_CONVERTER.slice(1),
  defaultValues: {
    from: LENGTHS.m.value,
    to: LENGTHS.km.value,
  },
  sampleValues: {
    from: LENGTHS.ft.value,
    to: LENGTHS.in.value,
  },
});
