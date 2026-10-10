import { createBaseConverterStore, createPersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { describeBaseConverterStore } from '../base-converter-store';

type DummyUnit = 'unitA' | 'unitB' | 'unitC';

const useDummyTestStore = createPersistedStore<BaseConverterState<DummyUnit>>(
  'dummy-test-store-key',
  createBaseConverterStore,
  (state) => ({
    auto: state.auto,
    from: state.from,
    to: state.to,
  })
);

describeBaseConverterStore<DummyUnit>('describeBaseConverterStore helper', {
  store: useDummyTestStore,
  storageKey: 'dummy-test-store-key',
  defaultValues: {
    from: 'unitA',
    to: 'unitB',
  },
  sampleValues: {
    from: 'unitB',
    to: 'unitC',
  },
});
