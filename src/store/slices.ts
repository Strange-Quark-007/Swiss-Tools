import { AutoState, InputState, OutputState, FromState, ToState, Resettable } from '@/types/base-state';

export type Setter<T> = (state: Partial<T> | ((state: T) => Partial<T>)) => void;

export const createAutoSlice = <T extends AutoState>(set: Setter<T>): AutoState => ({
  auto: true,
  setAuto: (auto) => set({ auto } as Partial<T>),
});

export const createInputSlice = <T extends InputState>(set: Setter<T>): InputState => ({
  fromValue: '',
  setFromValue: (fromValue) => set({ fromValue } as Partial<T>),
});

export const createOutputSlice = <T extends OutputState>(set: Setter<T>): OutputState => ({
  toValue: '',
  toError: undefined,
  setToValue: (toValue) => set({ toValue } as Partial<T>),
  setToError: (toError) => set({ toError } as Partial<T>),
});

export const createFromSlice = <U, T extends FromState<U>>(set: Setter<T>): FromState<U> => ({
  from: undefined,
  setFrom: (from) => set({ from } as Partial<T>),
});

export const createToSlice = <U, T extends ToState<U>>(set: Setter<T>): ToState<U> => ({
  to: undefined,
  setTo: (to) => set({ to } as Partial<T>),
});

export const createResetSlice = <T extends InputState & OutputState & Resettable>(set: Setter<T>): Resettable => ({
  reset: () => set({ fromValue: '', toValue: '', toError: undefined } as Partial<T>),
});
