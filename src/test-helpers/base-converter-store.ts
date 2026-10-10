import { describe, it, expect, beforeEach } from 'vitest';
import { StoreApi, UseBoundStore } from 'zustand';

import { BaseConverterState } from '@/types/base-state';

export interface BaseConverterStoreTestConfig<T> {
  store: UseBoundStore<StoreApi<BaseConverterState<T>>>;
  storageKey: string;
  defaultValues: {
    from: T;
    to: T;
  };
  sampleValues: {
    from: T;
    to: T;
  };
}

export const describeBaseConverterStore = <T>(
  suiteName: string,
  config: BaseConverterStoreTestConfig<T>
) => {
  const { store, storageKey, defaultValues, sampleValues } = config;

  describe(suiteName, () => {
    beforeEach(() => {
      localStorage.clear();

      store.setState({
        auto: true,
        from: defaultValues.from,
        to: defaultValues.to,
        fromValue: '',
        toValue: '',
        toError: undefined,
      });
    });

    it('should initialize with default converter values', () => {
      const state = store.getState();

      expect(state.auto).toBe(true);
      expect(state.from).toBe(defaultValues.from);
      expect(state.to).toBe(defaultValues.to);
      expect(state.fromValue).toBe('');
      expect(state.toValue).toBe('');
      expect(state.toError).toBeUndefined();
    });

    it('should update auto toggle state', () => {
      store.getState().setAuto(false);
      expect(store.getState().auto).toBe(false);

      store.getState().setAuto(true);
      expect(store.getState().auto).toBe(true);
    });

    it('should update from and to selections', () => {
      store.getState().setFrom(sampleValues.from);
      expect(store.getState().from).toBe(sampleValues.from);

      store.getState().setTo(sampleValues.to);
      expect(store.getState().to).toBe(sampleValues.to);
    });

    it('should update input text (fromValue)', () => {
      store.getState().setFromValue('123.45');
      expect(store.getState().fromValue).toBe('123.45');
    });

    it('should update output text (toValue) and output error (toError)', () => {
      store.getState().setToValue('678.9');
      expect(store.getState().toValue).toBe('678.9');

      store.getState().setToError('Conversion error');
      expect(store.getState().toError).toBe('Conversion error');
    });

    it('should reset input, output, and error while preserving configuration', () => {
      store.setState({
        auto: false,
        from: sampleValues.from,
        to: sampleValues.to,
        fromValue: 'some input',
        toValue: 'some output',
        toError: 'an error',
      });

      store.getState().reset();

      const state = store.getState();
      expect(state.fromValue).toBe('');
      expect(state.toValue).toBe('');
      expect(state.toError).toBeUndefined();

      expect(state.auto).toBe(false);
      expect(state.from).toBe(sampleValues.from);
      expect(state.to).toBe(sampleValues.to);
    });

    it('should persist only auto, from, and to settings (partializeSettings)', () => {
      store.setState({
        auto: false,
        from: sampleValues.from,
        to: sampleValues.to,
        fromValue: 'ephemeral from',
        toValue: 'ephemeral to',
        toError: undefined,
      });

      const storedRaw = localStorage.getItem(storageKey);
      expect(storedRaw).not.toBeNull();

      const parsed = JSON.parse(storedRaw!);
      expect(parsed.state).toEqual({
        auto: false,
        from: sampleValues.from,
        to: sampleValues.to,
      });
      expect(parsed.state.fromValue).toBeUndefined();
      expect(parsed.state.toValue).toBeUndefined();
    });
  });
};
