export interface AutoState {
  auto: boolean;
  setAuto: (auto: boolean) => void;
}

export interface FromState<T> {
  from?: T;
  setFrom: (value: T) => void;
}

export interface ToState<T> {
  to?: T;
  setTo: (value: T) => void;
}

export interface InputState {
  fromValue: string;
  setFromValue: (value: string) => void;
}

export interface OutputState {
  toValue: string;
  toError?: string;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
}

export interface Resettable {
  reset: () => void;
}

export interface BaseIOState extends AutoState, InputState, OutputState {}

export interface BaseConverterState<T> extends BaseIOState, FromState<T>, ToState<T>, Resettable {}
