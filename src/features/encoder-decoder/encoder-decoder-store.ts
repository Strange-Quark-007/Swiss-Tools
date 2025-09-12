import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

interface EncoderDecoderState {
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

const createEncoderDecoderStore: StoreCreator<EncoderDecoderState> = (set) => ({
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

const partializeSettings = (state: EncoderDecoderState) => ({
  auto: state.auto,
});

export const useEncoderDecoderStore = createRoutePersistedStore<EncoderDecoderState>(
  ROUTES.ENCODER_DECODER,
  createEncoderDecoderStore,
  partializeSettings
);
