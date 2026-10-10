import { describe, it, expect, beforeEach } from 'vitest';

import { useLoremGeneratorStore } from '../lorem-generator-store';
import { LOREM } from '../utils';

describe('useLoremGeneratorStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useLoremGeneratorStore.setState({
      count: 10,
      type: LOREM.paragraph.value,
      toValue: '',
      toError: undefined,
    });
  });

  it('should initialize with expected initial/default state', () => {
    const state = useLoremGeneratorStore.getState();

    expect(state.count).toBe(10);
    expect(state.type).toBe(LOREM.paragraph.value);
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
  });

  it('should update type selection via setType', () => {
    useLoremGeneratorStore.getState().setType(LOREM.word.value);
    expect(useLoremGeneratorStore.getState().type).toBe(LOREM.word.value);

    useLoremGeneratorStore.getState().setType(LOREM.sentence.value);
    expect(useLoremGeneratorStore.getState().type).toBe(LOREM.sentence.value);
  });

  it('should update count via setCount', () => {
    useLoremGeneratorStore.getState().setCount(5);
    expect(useLoremGeneratorStore.getState().count).toBe(5);

    useLoremGeneratorStore.getState().setCount(50);
    expect(useLoremGeneratorStore.getState().count).toBe(50);
  });

  it('should update output value and error state', () => {
    useLoremGeneratorStore.getState().setToValue('Lorem ipsum dolor sit amet');
    expect(useLoremGeneratorStore.getState().toValue).toBe('Lorem ipsum dolor sit amet');

    useLoremGeneratorStore.getState().setToError('Invalid count');
    expect(useLoremGeneratorStore.getState().toError).toBe('Invalid count');
  });

  it('should reset output value and error while preserving type and count configuration', () => {
    useLoremGeneratorStore.setState({
      count: 25,
      type: LOREM.sentence.value,
      toValue: 'Generated sentences...',
      toError: 'Some error',
    });

    useLoremGeneratorStore.getState().reset();

    const state = useLoremGeneratorStore.getState();
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();

    // Configuration remains preserved
    expect(state.count).toBe(25);
    expect(state.type).toBe(LOREM.sentence.value);
  });

  it('should persist only type and count settings (partializeSettings)', () => {
    useLoremGeneratorStore.setState({
      count: 15,
      type: LOREM.word.value,
      toValue: 'ephemeral output',
      toError: undefined,
    });

    const storedRaw = localStorage.getItem('lorem-generator');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({
      count: 15,
      type: LOREM.word.value,
    });
    expect(parsed.state.toValue).toBeUndefined();
    expect(parsed.state.toError).toBeUndefined();
  });
});
