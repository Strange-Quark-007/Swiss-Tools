import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { BaseType } from './utils';

export interface NumberConverterState extends BaseConverterState<BaseType> {
  fromCustomBase: string;
  toCustomBase: string;

  setFromCustomBase: (value: string) => void;
  setToCustomBase: (value: string) => void;
}

const createNumberConverterStore: StoreCreator<NumberConverterState> = (set) => ({
  ...createBaseConverterStore(set),
  fromCustomBase: '',
  toCustomBase: '',

  setFromCustomBase: (fromCustomBase) => set({ fromCustomBase }),
  setToCustomBase: (toCustomBase) => set({ toCustomBase }),
});

const partializeSettings = (state: NumberConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
  fromCustomBase: state.fromCustomBase,
  toCustomBase: state.toCustomBase,
});

export const useNumberConverterStore = createRoutePersistedStore(
  ROUTES.NUMBER_CONVERTER,
  createNumberConverterStore,
  partializeSettings
);
