import { describe, it, expect, beforeEach } from 'vitest';

import { useNumberConverterStore } from '../number-converter-store';
import { BASES } from '../utils';

describe('useNumberConverterStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useNumberConverterStore.setState({
      auto: true,
      from: BASES.decimal.value,
      to: BASES.binary.value,
      fromCustomBase: '',
      toCustomBase: '',
      fromValue: '',
      toValue: '',
      toError: undefined,
    });
  });

  it('should initialize with expected initial/default state', () => {
    const state = useNumberConverterStore.getState();

    expect(state.auto).toBe(true);
    expect(state.from).toBe(BASES.decimal.value);
    expect(state.to).toBe(BASES.binary.value);
    expect(state.fromCustomBase).toBe('');
    expect(state.toCustomBase).toBe('');
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
  });

  it('should update auto state via setAuto', () => {
    useNumberConverterStore.getState().setAuto(false);
    expect(useNumberConverterStore.getState().auto).toBe(false);

    useNumberConverterStore.getState().setAuto(true);
    expect(useNumberConverterStore.getState().auto).toBe(true);
  });

  it('should update base selection via setFrom and setTo', () => {
    useNumberConverterStore.getState().setFrom(BASES.hex.value);
    expect(useNumberConverterStore.getState().from).toBe(BASES.hex.value);

    useNumberConverterStore.getState().setTo(BASES.octal.value);
    expect(useNumberConverterStore.getState().to).toBe(BASES.octal.value);
  });

  it('should update custom bases via setFromCustomBase and setToCustomBase', () => {
    useNumberConverterStore.getState().setFromCustomBase('12');
    expect(useNumberConverterStore.getState().fromCustomBase).toBe('12');

    useNumberConverterStore.getState().setToCustomBase('36');
    expect(useNumberConverterStore.getState().toCustomBase).toBe('36');
  });

  it('should update input and output values', () => {
    useNumberConverterStore.getState().setFromValue('1010');
    expect(useNumberConverterStore.getState().fromValue).toBe('1010');

    useNumberConverterStore.getState().setToValue('10');
    expect(useNumberConverterStore.getState().toValue).toBe('10');

    useNumberConverterStore.getState().setToError('Invalid base');
    expect(useNumberConverterStore.getState().toError).toBe('Invalid base');
  });

  it('should reset ephemeral state (values and errors) without affecting custom bases or options', () => {
    useNumberConverterStore.setState({
      auto: false,
      from: BASES.custom.value,
      to: BASES.custom.value,
      fromCustomBase: '5',
      toCustomBase: '7',
      fromValue: '4321',
      toValue: 'output',
      toError: 'Some error',
    });

    useNumberConverterStore.getState().resetEphemeral();

    const state = useNumberConverterStore.getState();
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();

    // Configuration and custom bases must remain intact
    expect(state.auto).toBe(false);
    expect(state.from).toBe(BASES.custom.value);
    expect(state.to).toBe(BASES.custom.value);
    expect(state.fromCustomBase).toBe('5');
    expect(state.toCustomBase).toBe('7');
  });

  it('should reset both ephemeral values and custom bases when reset is invoked', () => {
    useNumberConverterStore.setState({
      auto: false,
      from: BASES.custom.value,
      to: BASES.custom.value,
      fromCustomBase: '12',
      toCustomBase: '24',
      fromValue: 'input text',
      toValue: 'output text',
      toError: 'Some error',
    });

    useNumberConverterStore.getState().reset();

    const state = useNumberConverterStore.getState();
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
    expect(state.fromCustomBase).toBe('');
    expect(state.toCustomBase).toBe('');

    // Predefined selections and auto toggle remain preserved
    expect(state.auto).toBe(false);
    expect(state.from).toBe(BASES.custom.value);
    expect(state.to).toBe(BASES.custom.value);
  });

  it('should persist settings including custom bases in localStorage (partializeSettings)', () => {
    useNumberConverterStore.setState({
      auto: false,
      from: BASES.hex.value,
      to: BASES.custom.value,
      fromCustomBase: '16',
      toCustomBase: '32',
      fromValue: 'ephemeral input',
      toValue: 'ephemeral output',
      toError: undefined,
    });

    const storedRaw = localStorage.getItem('number-converter');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({
      auto: false,
      from: BASES.hex.value,
      to: BASES.custom.value,
      fromCustomBase: '16',
      toCustomBase: '32',
    });
    expect(parsed.state.fromValue).toBeUndefined();
    expect(parsed.state.toValue).toBeUndefined();
  });
});
