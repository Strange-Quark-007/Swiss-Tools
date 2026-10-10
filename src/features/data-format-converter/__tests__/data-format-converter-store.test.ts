import { describe, it, expect, beforeEach } from 'vitest';

import { useDataFormatConverterStore } from '../data-format-converter-store';
import { DATA_FORMATS } from '../utils';

describe('useDataFormatConverterStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useDataFormatConverterStore.setState({
      auto: true,
      from: DATA_FORMATS.json.value,
      to: DATA_FORMATS.yaml.value,
      fromValue: '',
      toValue: '',
      toError: undefined,
    });
  });

  it('should initialize with expected initial/default state', () => {
    const state = useDataFormatConverterStore.getState();

    expect(state.auto).toBe(true);
    expect(state.from).toBe(DATA_FORMATS.json.value);
    expect(state.to).toBe(DATA_FORMATS.yaml.value);
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
  });

  it('should update auto mode via setAuto', () => {
    useDataFormatConverterStore.getState().setAuto(false);
    expect(useDataFormatConverterStore.getState().auto).toBe(false);

    useDataFormatConverterStore.getState().setAuto(true);
    expect(useDataFormatConverterStore.getState().auto).toBe(true);
  });

  it('should update from and to format selections', () => {
    useDataFormatConverterStore.getState().setFrom(DATA_FORMATS.csv.value);
    expect(useDataFormatConverterStore.getState().from).toBe(DATA_FORMATS.csv.value);

    useDataFormatConverterStore.getState().setTo(DATA_FORMATS.xml.value);
    expect(useDataFormatConverterStore.getState().to).toBe(DATA_FORMATS.xml.value);
  });

  it('should update input and output text and error', () => {
    useDataFormatConverterStore.getState().setFromValue('{"key": "value"}');
    expect(useDataFormatConverterStore.getState().fromValue).toBe('{"key": "value"}');

    useDataFormatConverterStore.getState().setToValue('key: value\n');
    expect(useDataFormatConverterStore.getState().toValue).toBe('key: value\n');

    useDataFormatConverterStore.getState().setToError('Parsing error');
    expect(useDataFormatConverterStore.getState().toError).toBe('Parsing error');
  });

  it('should reset input, output, and errors without resetting format configurations', () => {
    useDataFormatConverterStore.setState({
      auto: false,
      from: DATA_FORMATS.toml.value,
      to: DATA_FORMATS.ini.value,
      fromValue: 'some data',
      toValue: 'converted data',
      toError: 'some error',
    });

    useDataFormatConverterStore.getState().reset();

    const state = useDataFormatConverterStore.getState();
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();

    // Configurations remain preserved
    expect(state.auto).toBe(false);
    expect(state.from).toBe(DATA_FORMATS.toml.value);
    expect(state.to).toBe(DATA_FORMATS.ini.value);
  });

  it('should persist only auto, from, and to settings (partializeSettings)', () => {
    useDataFormatConverterStore.setState({
      auto: false,
      from: DATA_FORMATS.yaml.value,
      to: DATA_FORMATS.json.value,
      fromValue: 'ephemeral yaml input',
      toValue: 'ephemeral json output',
      toError: undefined,
    });

    const storedRaw = localStorage.getItem('data-format-converter');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({
      auto: false,
      from: DATA_FORMATS.yaml.value,
      to: DATA_FORMATS.json.value,
    });
    expect(parsed.state.fromValue).toBeUndefined();
    expect(parsed.state.toValue).toBeUndefined();
  });
});
