import { describe, it, expect, beforeEach } from 'vitest';

import { useTimestampConverterStore } from '../timestamp-converter-store';
import { TIMESTAMP_FORMATS } from '../utils';

describe('useTimestampConverterStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useTimestampConverterStore.setState({
      auto: true,
      from: TIMESTAMP_FORMATS.unixSec.value,
      to: TIMESTAMP_FORMATS.iso8601.value,
      fromValue: '',
      toValue: '',
      toError: undefined,
    });
  });

  it('should initialize with expected default values', () => {
    const state = useTimestampConverterStore.getState();

    expect(state.auto).toBe(true);
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
  });

  it('should update auto toggle state', () => {
    useTimestampConverterStore.getState().setAuto(false);
    expect(useTimestampConverterStore.getState().auto).toBe(false);

    useTimestampConverterStore.getState().setAuto(true);
    expect(useTimestampConverterStore.getState().auto).toBe(true);
  });

  it('should update from and to format types', () => {
    useTimestampConverterStore.getState().setFrom(TIMESTAMP_FORMATS.iso8601.value);
    expect(useTimestampConverterStore.getState().from).toBe(TIMESTAMP_FORMATS.iso8601.value);

    useTimestampConverterStore.getState().setTo(TIMESTAMP_FORMATS.unixSec.value);
    expect(useTimestampConverterStore.getState().to).toBe(TIMESTAMP_FORMATS.unixSec.value);
  });

  it('should update input text (fromValue)', () => {
    useTimestampConverterStore.getState().setFromValue('1718000000');
    expect(useTimestampConverterStore.getState().fromValue).toBe('1718000000');
  });

  it('should update output text (toValue) and output error (toError)', () => {
    useTimestampConverterStore.getState().setToValue('2024-06-10T06:13:20.000Z');
    expect(useTimestampConverterStore.getState().toValue).toBe('2024-06-10T06:13:20.000Z');

    useTimestampConverterStore.getState().setToError('Invalid date');
    expect(useTimestampConverterStore.getState().toError).toBe('Invalid date');
  });

  it('should reset input, output, and error without resetting configuration options', () => {
    useTimestampConverterStore.setState({
      auto: false,
      from: TIMESTAMP_FORMATS.sql.value,
      to: TIMESTAMP_FORMATS.utc.value,
      fromValue: '2024-06-10 12:00:00',
      toValue: 'Mon, 10 Jun 2024 12:00:00 GMT',
      toError: 'An error',
    });

    useTimestampConverterStore.getState().reset();

    const state = useTimestampConverterStore.getState();
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();

    // Configuration remains intact
    expect(state.auto).toBe(false);
    expect(state.from).toBe(TIMESTAMP_FORMATS.sql.value);
    expect(state.to).toBe(TIMESTAMP_FORMATS.utc.value);
  });

  it('should persist only auto, from, and to settings (partializeSettings)', () => {
    useTimestampConverterStore.setState({
      auto: false,
      from: TIMESTAMP_FORMATS.sql.value,
      to: TIMESTAMP_FORMATS.utc.value,
      fromValue: 'temporary input text',
      toValue: 'temporary output text',
      toError: undefined,
    });

    const storedRaw = localStorage.getItem('timestamp-converter');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({
      auto: false,
      from: TIMESTAMP_FORMATS.sql.value,
      to: TIMESTAMP_FORMATS.utc.value,
    });
    expect(parsed.state.fromValue).toBeUndefined();
    expect(parsed.state.toValue).toBeUndefined();
  });
});
