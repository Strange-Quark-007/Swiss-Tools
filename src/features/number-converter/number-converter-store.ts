import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

interface NumberConverterState {
  auto: boolean;
  fromValue: string;
  toValue: string;
  fromCustomBase: string;
  toCustomBase: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  setFromCustomBase: (value: string) => void;
  setToCustomBase: (value: string) => void;
  resetEphemeral: () => void;
  reset: () => void;
}

const createNumberConverterStore: StoreCreator<NumberConverterState> = (set) => ({
  auto: true,
  fromValue: '',
  toValue: '',
  fromCustomBase: '',
  toCustomBase: '',
  toError: undefined,

  setAuto: (auto) => set({ auto }),
  setFromValue: (fromValue) => set({ fromValue }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
  setFromCustomBase: (fromCustomBase) => set({ fromCustomBase }),
  setToCustomBase: (toCustomBase) => set({ toCustomBase }),
  resetEphemeral: () => set({ fromValue: '', toValue: '', toError: undefined }),
  reset: () => set({ fromValue: '', toValue: '', fromCustomBase: '', toCustomBase: '', toError: undefined }),
});

const partializeSettings = (state: NumberConverterState) => ({
  auto: state.auto,
  fromCustomBase: state.fromCustomBase,
  toCustomBase: state.toCustomBase,
});

export const useNumberConverterStore = createRoutePersistedStore<NumberConverterState>(
  ROUTES.NUMBER_CONVERTER,
  createNumberConverterStore,
  partializeSettings
);
