import { describe, it, expect, beforeEach } from 'vitest';

import { useHashGeneratorStore } from '../hash-generator-store';
import { HASHING_ALGOS, HASH_ENCODINGS } from '../utils';

describe('useHashGeneratorStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useHashGeneratorStore.setState({
      auto: true,
      algo: HASHING_ALGOS.sha256.value,
      encoding: HASH_ENCODINGS.hex.value,
      fromValue: '',
      toValue: '',
      toError: undefined,
    });
  });

  it('should initialize with expected initial/default state', () => {
    const state = useHashGeneratorStore.getState();

    expect(state.auto).toBe(true);
    expect(state.algo).toBe(HASHING_ALGOS.sha256.value);
    expect(state.encoding).toBe(HASH_ENCODINGS.hex.value);
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
  });

  it('should update auto mode via setAuto', () => {
    useHashGeneratorStore.getState().setAuto(false);
    expect(useHashGeneratorStore.getState().auto).toBe(false);

    useHashGeneratorStore.getState().setAuto(true);
    expect(useHashGeneratorStore.getState().auto).toBe(true);
  });

  it('should update algo and encoding selections', () => {
    useHashGeneratorStore.getState().setAlgo(HASHING_ALGOS.md5.value);
    expect(useHashGeneratorStore.getState().algo).toBe(HASHING_ALGOS.md5.value);

    useHashGeneratorStore.getState().setEncoding(HASH_ENCODINGS.base64url.value);
    expect(useHashGeneratorStore.getState().encoding).toBe(HASH_ENCODINGS.base64url.value);
  });

  it('should update input, output, and error state', () => {
    useHashGeneratorStore.getState().setFromValue('Hello world');
    expect(useHashGeneratorStore.getState().fromValue).toBe('Hello world');

    useHashGeneratorStore.getState().setToValue('a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e');
    expect(useHashGeneratorStore.getState().toValue).toBe(
      'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
    );

    useHashGeneratorStore.getState().setToError('Hash generation error');
    expect(useHashGeneratorStore.getState().toError).toBe('Hash generation error');
  });

  it('should reset input, output, and errors without resetting algo and encoding', () => {
    useHashGeneratorStore.setState({
      auto: false,
      algo: HASHING_ALGOS.sha512.value,
      encoding: HASH_ENCODINGS.base64.value,
      fromValue: 'input to clear',
      toValue: 'output to clear',
      toError: 'error to clear',
    });

    useHashGeneratorStore.getState().reset();

    const state = useHashGeneratorStore.getState();
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();

    // Configuration remains preserved
    expect(state.auto).toBe(false);
    expect(state.algo).toBe(HASHING_ALGOS.sha512.value);
    expect(state.encoding).toBe(HASH_ENCODINGS.base64.value);
  });

  it('should persist only auto, algo, and encoding settings (partializeSettings)', () => {
    useHashGeneratorStore.setState({
      auto: false,
      algo: HASHING_ALGOS.sha3_256.value,
      encoding: HASH_ENCODINGS.base64url.value,
      fromValue: 'ephemeral input',
      toValue: 'ephemeral output',
      toError: undefined,
    });

    const storedRaw = localStorage.getItem('hash-generator');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({
      auto: false,
      algo: HASHING_ALGOS.sha3_256.value,
      encoding: HASH_ENCODINGS.base64url.value,
    });
    expect(parsed.state.fromValue).toBeUndefined();
    expect(parsed.state.toValue).toBeUndefined();
  });
});
