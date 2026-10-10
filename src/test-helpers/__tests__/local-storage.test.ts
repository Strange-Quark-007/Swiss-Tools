import { describe, it, expect } from 'vitest';

import { createMockStorage, getStoredState } from '../local-storage';

describe('local-storage test helpers', () => {
  it('should support standard Web Storage operations', () => {
    const storage = createMockStorage();

    expect(storage.length).toBe(0);
    expect(storage.getItem('nonexistent')).toBeNull();

    storage.setItem('key1', 'val1');
    expect(storage.length).toBe(1);
    expect(storage.getItem('key1')).toBe('val1');
    expect(storage.key(0)).toBe('key1');
    expect(storage.key(1)).toBeNull();

    storage.removeItem('key1');
    expect(storage.length).toBe(0);
    expect(storage.getItem('key1')).toBeNull();

    storage.setItem('a', '1');
    storage.setItem('b', '2');
    expect(storage.length).toBe(2);
    storage.clear();
    expect(storage.length).toBe(0);
  });

  describe('getStoredState', () => {
    it('should return null when key does not exist or has invalid JSON', () => {
      localStorage.clear();
      expect(getStoredState('missing')).toBeNull();

      localStorage.setItem('invalid-json', 'not-json');
      expect(getStoredState('invalid-json')).toBeNull();
    });

    it('should parse and return stored state when present', () => {
      localStorage.setItem('my-store', JSON.stringify({ state: { count: 42 } }));
      expect(getStoredState<{ count: number }>('my-store')).toEqual({ count: 42 });

      localStorage.setItem('no-state-prop', JSON.stringify({ other: true }));
      expect(getStoredState('no-state-prop')).toBeNull();
    });
  });
});
