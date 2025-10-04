import { ROUTES } from '@/constants/routes';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';

export interface JwtDecoderState {
  auto: boolean;
  input: string;
  header: string;
  payload: string;
  error?: string;

  setAuto: (auto: boolean) => void;
  setInput: (value: string) => void;
  setHeader: (value: string) => void;
  setPayload: (value: string) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

const jwtDecoderStore: StoreCreator<JwtDecoderState> = (set) => ({
  auto: true,
  input: '',
  header: '',
  payload: '',
  error: undefined,

  setAuto: (auto) => set({ auto }),
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
