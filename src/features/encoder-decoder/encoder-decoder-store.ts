import { ROUTES } from '@/constants/routes';
import {
  createAutoSlice,
  createIngestSlice,
  createInputSlice,
  createOutputSlice,
  createResetSlice,
} from '@/store/slices';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { BaseIOState, Ingestible, Resettable } from '@/types/base-state';

import { CodecType, ModeType } from './utils';

export interface EncoderDecoderState extends BaseIOState, Ingestible, Resettable {
  codec?: CodecType;
  mode?: ModeType;
  setCodec: (codec: CodecType) => void;
  setMode: (mode: ModeType) => void;
}

const createEncoderDecoderStore: StoreCreator<EncoderDecoderState> = (set) => ({
  ...createAutoSlice(set),
  ...createInputSlice(set),
  ...createOutputSlice(set),
  ...createIngestSlice(set),
  ...createResetSlice(set),

  setCodec: (codec) => set({ codec }),
  setMode: (mode) => set({ mode }),
});

const partializeSettings = (state: EncoderDecoderState) => ({
  auto: state.auto,
  codec: state.codec,
  mode: state.mode,
});

export const useEncoderDecoderStore = createRoutePersistedStore(
  ROUTES.ENCODER_DECODER,
  createEncoderDecoderStore,
  partializeSettings
);
