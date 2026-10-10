import { describe, it, expect, beforeEach } from 'vitest';

import { useCaseConverterStore } from '../case-converter-store';
import { CASES } from '../utils';

describe('useCaseConverterStore', () => {
  beforeEach(() => {
    localStorage.clear();

    // Reset store state before each test
    useCaseConverterStore.setState({
      auto: true,
      from: CASES.lowercase.value,
      to: CASES.uppercase.value,
      fromValue: '',
      toValue: '',
      toError: undefined,
    });
  });

  it('should initialize with expected default values', () => {
    const state = useCaseConverterStore.getState();

    expect(state.auto).toBe(true);
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
  });

  it('should update auto toggle state', () => {
    useCaseConverterStore.getState().setAuto(false);
    expect(useCaseConverterStore.getState().auto).toBe(false);

    useCaseConverterStore.getState().setAuto(true);
    expect(useCaseConverterStore.getState().auto).toBe(true);
  });

  it('should update from and to case types', () => {
    useCaseConverterStore.getState().setFrom(CASES.snakecase.value);
    expect(useCaseConverterStore.getState().from).toBe(CASES.snakecase.value);

    useCaseConverterStore.getState().setTo(CASES.camelcase.value);
    expect(useCaseConverterStore.getState().to).toBe(CASES.camelcase.value);
  });

  it('should update input text (fromValue)', () => {
    useCaseConverterStore.getState().setFromValue('sample text');
    expect(useCaseConverterStore.getState().fromValue).toBe('sample text');
  });

  it('should update output text (toValue) and output error (toError)', () => {
    useCaseConverterStore.getState().setToValue('CONVERTED TEXT');
    expect(useCaseConverterStore.getState().toValue).toBe('CONVERTED TEXT');

    useCaseConverterStore.getState().setToError('Conversion failed');
    expect(useCaseConverterStore.getState().toError).toBe('Conversion failed');
  });

  it('should reset input, output, and error without resetting configuration options', () => {
    useCaseConverterStore.setState({
      auto: false,
      from: CASES.kebabcase.value,
      to: CASES.pascalcase.value,
      fromValue: 'some input',
      toValue: 'SomeOutput',
      toError: 'An error',
    });

    useCaseConverterStore.getState().reset();

    const state = useCaseConverterStore.getState();
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();

    // Configuration remains intact
    expect(state.auto).toBe(false);
    expect(state.from).toBe(CASES.kebabcase.value);
    expect(state.to).toBe(CASES.pascalcase.value);
  });

  it('should persist only auto, from, and to settings (partializeSettings)', () => {
    useCaseConverterStore.setState({
      auto: false,
      from: CASES.kebabcase.value,
      to: CASES.pascalcase.value,
      fromValue: 'temporary input text',
      toValue: 'temporary output text',
      toError: undefined,
    });

    const storedRaw = localStorage.getItem('case-converter');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({
      auto: false,
      from: CASES.kebabcase.value,
      to: CASES.pascalcase.value,
    });
    expect(parsed.state.fromValue).toBeUndefined();
    expect(parsed.state.toValue).toBeUndefined();
  });
});
