import { ROUTES } from '@/constants/routes';
import { describeBaseConverterStore } from '@/test-helpers/base-converter-store';

import { WEIGHTS, WeightType } from '../utils';
import { useWeightConverterStore } from '../weight-converter-store';

describeBaseConverterStore<WeightType>('useWeightConverterStore', {
  store: useWeightConverterStore,
  storageKey: ROUTES.WEIGHT_CONVERTER.slice(1),
  defaultValues: {
    from: WEIGHTS.g.value,
    to: WEIGHTS.kg.value,
  },
  sampleValues: {
    from: WEIGHTS.lb.value,
    to: WEIGHTS.oz.value,
  },
});
