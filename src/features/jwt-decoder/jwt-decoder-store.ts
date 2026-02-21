import { ROUTES } from '@/constants/routes';
import { createAutoSlice } from '@/store/slices';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { AutoState, Resettable } from '@/types/base-state';

export interface JwtDecoderState extends AutoState, Resettable {
  input: string;
  header: string;
  payload: string;
  error?: string;

  setInput: (value: string) => void;
  setHeader: (value: string) => void;
  setPayload: (value: string) => void;
  setError: (error?: string) => void;
}

const jwtDecoderStore: StoreCreator<JwtDecoderState> = (set) => ({
  ...createAutoSlice(set),
  input: '',
  header: '',
  payload: '',
  error: undefined,

  setInput: (input) => set({ input }),
  setHeader: (header) => set({ header }),
  setPayload: (payload) => set({ payload }),
  setError: (error) => set({ error }),
  reset: () => set({ input: '', header: '', payload: '', error: undefined }),
});

const partializeSettings = (state: JwtDecoderState) => ({
  auto: state.auto,
});

export const useJwtDecoderStore = createRoutePersistedStore<JwtDecoderState>(
  ROUTES.JWT_DECODER,
  jwtDecoderStore,
  partializeSettings
);
