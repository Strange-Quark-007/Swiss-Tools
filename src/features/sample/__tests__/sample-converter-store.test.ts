import { describe, it, expect, beforeEach } from 'vitest';

import { useSampleConverterStore } from '../sample-converter-store';
import { SAMPLE } from '../utils';

describe('useSampleConverterStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useSampleConverterStore.setState({
      auto: true,
      // @ts-expect-error - Scaffold placeholder type mismatch
      from: SAMPLE.sample.value,
      // @ts-expect-error - Scaffold placeholder type mismatch
      to: SAMPLE.sample.value,
      fromValue: '',
      toValue: '',
      toError: undefined,
    });
  });

  it('should initialize with default sample state', () => {
    const state = useSampleConverterStore.getState();

    expect(state.auto).toBe(true);
    expect(state.from).toBe(SAMPLE.sample.value);
    expect(state.to).toBe(SAMPLE.sample.value);
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
  });

  it('should update and reset state while preserving configuration', () => {
    useSampleConverterStore.getState().setFromValue('sample input');
    expect(useSampleConverterStore.getState().fromValue).toBe('sample input');

    useSampleConverterStore.getState().reset();
    expect(useSampleConverterStore.getState().fromValue).toBe('');
  });
});
