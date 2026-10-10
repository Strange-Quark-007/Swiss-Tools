import { describe, it, expect, beforeEach } from 'vitest';

import { useJwtDecoderStore } from '../jwt-decoder-store';

describe('useJwtDecoderStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useJwtDecoderStore.setState({
      auto: true,
      input: '',
      header: '',
      payload: '',
      error: undefined,
    });
  });

  it('should initialize with expected initial/default state', () => {
    const state = useJwtDecoderStore.getState();

    expect(state.auto).toBe(true);
    expect(state.input).toBe('');
    expect(state.header).toBe('');
    expect(state.payload).toBe('');
    expect(state.error).toBeUndefined();
  });

  it('should update auto mode via setAuto', () => {
    useJwtDecoderStore.getState().setAuto(false);
    expect(useJwtDecoderStore.getState().auto).toBe(false);

    useJwtDecoderStore.getState().setAuto(true);
    expect(useJwtDecoderStore.getState().auto).toBe(true);
  });

  it('should update input, header, payload, and error state', () => {
    useJwtDecoderStore.getState().setInput('sample.jwt.token');
    expect(useJwtDecoderStore.getState().input).toBe('sample.jwt.token');

    useJwtDecoderStore.getState().setHeader('{"alg":"HS256"}');
    expect(useJwtDecoderStore.getState().header).toBe('{"alg":"HS256"}');

    useJwtDecoderStore.getState().setPayload('{"sub":"user123"}');
    expect(useJwtDecoderStore.getState().payload).toBe('{"sub":"user123"}');

    useJwtDecoderStore.getState().setError('Invalid token');
    expect(useJwtDecoderStore.getState().error).toBe('Invalid token');
  });

  it('should reset input, header, payload, and error without resetting auto setting', () => {
    useJwtDecoderStore.setState({
      auto: false,
      input: 'sample.jwt.token',
      header: '{"alg":"HS256"}',
      payload: '{"sub":"user123"}',
      error: 'Some error',
    });

    useJwtDecoderStore.getState().reset();

    const state = useJwtDecoderStore.getState();
    expect(state.input).toBe('');
    expect(state.header).toBe('');
    expect(state.payload).toBe('');
    expect(state.error).toBeUndefined();

    // Auto setting remains intact
    expect(state.auto).toBe(false);
  });

  it('should persist only auto setting (partializeSettings)', () => {
    useJwtDecoderStore.setState({
      auto: false,
      input: 'ephemeral.jwt.token',
      header: '{"alg":"HS256"}',
      payload: '{"sub":"user"}',
      error: undefined,
    });

    const storedRaw = localStorage.getItem('jwt-decoder');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({
      auto: false,
    });
    expect(parsed.state.input).toBeUndefined();
    expect(parsed.state.header).toBeUndefined();
    expect(parsed.state.payload).toBeUndefined();
  });
});
