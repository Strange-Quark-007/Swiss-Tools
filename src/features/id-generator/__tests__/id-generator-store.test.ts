import { describe, it, expect, beforeEach } from 'vitest';

import { useIdGeneratorStore } from '../id-generator-store';
import { IDS } from '../utils';

describe('useIdGeneratorStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useIdGeneratorStore.setState({
      count: 10,
      type: IDS.uuidv4.value,
      toValue: '',
      toError: undefined,
    });
  });

  it('should initialize with expected initial/default state', () => {
    const state = useIdGeneratorStore.getState();

    expect(state.count).toBe(10);
    expect(state.type).toBe(IDS.uuidv4.value);
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
  });

  it('should update type selection via setType', () => {
    useIdGeneratorStore.getState().setType(IDS.nanoid.value);
    expect(useIdGeneratorStore.getState().type).toBe(IDS.nanoid.value);

    useIdGeneratorStore.getState().setType(IDS.ulid.value);
    expect(useIdGeneratorStore.getState().type).toBe(IDS.ulid.value);
  });

  it('should update count via setCount', () => {
    useIdGeneratorStore.getState().setCount(5);
    expect(useIdGeneratorStore.getState().count).toBe(5);

    useIdGeneratorStore.getState().setCount(50);
    expect(useIdGeneratorStore.getState().count).toBe(50);
  });

  it('should update output value and error state', () => {
    useIdGeneratorStore.getState().setToValue('generated-uuid-value');
    expect(useIdGeneratorStore.getState().toValue).toBe('generated-uuid-value');

    useIdGeneratorStore.getState().setToError('Error generating IDs');
    expect(useIdGeneratorStore.getState().toError).toBe('Error generating IDs');
  });

  it('should reset output value and error while preserving type and count configuration', () => {
    useIdGeneratorStore.setState({
      count: 25,
      type: IDS.uuidv7.value,
      toValue: 'some-id-value',
      toError: 'some-error',
    });

    useIdGeneratorStore.getState().reset();

    const state = useIdGeneratorStore.getState();
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();

    // Configuration remains preserved
    expect(state.count).toBe(25);
    expect(state.type).toBe(IDS.uuidv7.value);
  });

  it('should persist only type and count settings (partializeSettings)', () => {
    useIdGeneratorStore.setState({
      count: 20,
      type: IDS.uuidv1.value,
      toValue: 'ephemeral output',
      toError: undefined,
    });

    const storedRaw = localStorage.getItem('id-generator');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({
      count: 20,
      type: IDS.uuidv1.value,
    });
    expect(parsed.state.toValue).toBeUndefined();
    expect(parsed.state.toError).toBeUndefined();
  });
});
