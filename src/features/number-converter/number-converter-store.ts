import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { BaseType } from './utils';

export interface NumberConverterState extends BaseConverterState<BaseType> {
  fromCustomBase: string;
  toCustomBase: string;

  setFromCustomBase: (value: string) => void;
  setToCustomBase: (value: string) => void;
  resetEphemeral: () => void;
}

const createNumberConverterStore: StoreCreator<NumberConverterState> = (set) => ({
  ...createBaseConverterStore(set),
  fromCustomBase: '',
  toCustomBase: '',

  setFromCustomBase: (fromCustomBase) => set({ fromCustomBase }),
  setToCustomBase: (toCustomBase) => set({ toCustomBase }),
  resetEphemeral: () => set({ fromValue: '', toValue: '', toError: undefined }),
  reset: () => set({ fromValue: '', toValue: '', fromCustomBase: '', toCustomBase: '', toError: undefined }),
});

const partializeSettings = (state: NumberConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
  fromCustomBase: state.fromCustomBase,
  toCustomBase: state.toCustomBase,
});

export const useNumberConverterStore = createRoutePersistedStore<NumberConverterState>(
  ROUTES.NUMBER_CONVERTER,
  createNumberConverterStore,
  partializeSettings
);
