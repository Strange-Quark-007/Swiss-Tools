import { describe, it, expect, beforeEach } from 'vitest';

import { useEncoderDecoderStore } from '../encoder-decoder-store';
import { CODECS, MODES } from '../utils';

describe('useEncoderDecoderStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useEncoderDecoderStore.setState({
      auto: true,
      codec: CODECS.base64.value,
      mode: MODES.encode.value,
      fromValue: '',
      toValue: '',
      toError: undefined,
    });
  });

  it('should initialize with expected initial/default state', () => {
    const state = useEncoderDecoderStore.getState();

    expect(state.auto).toBe(true);
    expect(state.codec).toBe(CODECS.base64.value);
    expect(state.mode).toBe(MODES.encode.value);
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
  });

  it('should update auto mode via setAuto', () => {
    useEncoderDecoderStore.getState().setAuto(false);
    expect(useEncoderDecoderStore.getState().auto).toBe(false);

    useEncoderDecoderStore.getState().setAuto(true);
    expect(useEncoderDecoderStore.getState().auto).toBe(true);
  });

  it('should update codec and mode selections', () => {
    useEncoderDecoderStore.getState().setCodec(CODECS.base16.value);
    expect(useEncoderDecoderStore.getState().codec).toBe(CODECS.base16.value);

    useEncoderDecoderStore.getState().setMode(MODES.decode.value);
    expect(useEncoderDecoderStore.getState().mode).toBe(MODES.decode.value);
  });

  it('should update input, output, and error state', () => {
    useEncoderDecoderStore.getState().setFromValue('Hello world');
    expect(useEncoderDecoderStore.getState().fromValue).toBe('Hello world');

    useEncoderDecoderStore.getState().setToValue('SGVsbG8gd29ybGQ=');
    expect(useEncoderDecoderStore.getState().toValue).toBe('SGVsbG8gd29ybGQ=');

    useEncoderDecoderStore.getState().setToError('Transcode error');
    expect(useEncoderDecoderStore.getState().toError).toBe('Transcode error');
  });

  it('should reset input, output, and errors without resetting codec and mode', () => {
    useEncoderDecoderStore.setState({
      auto: false,
      codec: CODECS.url.value,
      mode: MODES.decode.value,
      fromValue: 'input to clear',
      toValue: 'output to clear',
      toError: 'error to clear',
    });

    useEncoderDecoderStore.getState().reset();

    const state = useEncoderDecoderStore.getState();
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();

    // Configuration remains preserved
    expect(state.auto).toBe(false);
    expect(state.codec).toBe(CODECS.url.value);
    expect(state.mode).toBe(MODES.decode.value);
  });

  it('should persist only auto, codec, and mode settings (partializeSettings)', () => {
    useEncoderDecoderStore.setState({
      auto: false,
      codec: CODECS.html.value,
      mode: MODES.decode.value,
      fromValue: 'ephemeral input',
      toValue: 'ephemeral output',
      toError: undefined,
    });

    const storedRaw = localStorage.getItem('encoder-decoder');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({
      auto: false,
      codec: CODECS.html.value,
      mode: MODES.decode.value,
    });
    expect(parsed.state.fromValue).toBeUndefined();
    expect(parsed.state.toValue).toBeUndefined();
  });
});
