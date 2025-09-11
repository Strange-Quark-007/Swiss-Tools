import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

interface DataFormatConverterState {
  auto: boolean;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  reset: () => void;
}

const createDataFormatConverterStore: StoreCreator<DataFormatConverterState> = (set) => ({
  auto: true,
  fromValue: '',
  toValue: '',
  toError: undefined,

  setAuto: (auto) => set({ auto }),
  setFromValue: (fromValue) => set({ fromValue }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
  reset: () =>
    set({
      fromValue: '',
      toValue: '',
      toError: undefined,
    }),
});

const partializeSettings = (state: DataFormatConverterState) => ({
  auto: state.auto,
});

export const useDataFormatConverterStore = createRoutePersistedStore<DataFormatConverterState>(
  ROUTES.DATA_FORMAT_CONVERTER,
  createDataFormatConverterStore,
  partializeSettings
);
