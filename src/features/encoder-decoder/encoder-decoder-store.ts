import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { registerRouteStore } from '@/store/store-registry';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';

import { CodecType, ModeType } from './utils';

export interface EncoderDecoderState {
  auto: boolean;
  codec?: CodecType;
  mode?: ModeType;
  fromValue: string;
  toValue: string;
  toError?: string;

  setAuto: (auto: boolean) => void;
  setCodec: (codec: CodecType) => void;
  setMode: (mode: ModeType) => void;
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
  setCodec: (codec) => set({ codec }),
  setMode: (mode) => set({ mode }),
  setFromValue: (fromValue) => set({ fromValue }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
  reset: () => set({ fromValue: '', toValue: '', toError: undefined }),
});

const partializeSettings = (state: EncoderDecoderState) => ({
  auto: state.auto,
  codec: state.codec,
  mode: state.mode,
});

export const useEncoderDecoderStore = createRoutePersistedStore<EncoderDecoderState>(
  ROUTES.ENCODER_DECODER,
  createEncoderDecoderStore,
  partializeSettings
);

registerRouteStore(ROUTES.ENCODER_DECODER, useEncoderDecoderStore, [SEARCH_PARAM_KEYS.CODEC, SEARCH_PARAM_KEYS.MODE]);
