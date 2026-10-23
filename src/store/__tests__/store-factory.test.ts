import { beforeEach, describe, expect, it } from 'vitest';

import { createPersistedStore, StoreCreator } from '../store-factory';

interface CounterState {
  count: number;
  label: string;
  increment: () => void;
  setLabel: (label: string) => void;
}

const createCounterStore: StoreCreator<CounterState> = (set) => ({
  count: 0,
  label: '',
  increment: () => set((state) => ({ count: state.count + 1 })),
  setLabel: (label) => set({ label }),
});

const partializeCount = (state: CounterState) => ({ count: state.count });

const readStoredState = (key: string) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

describe('createPersistedStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('hydrates persisted state through the default merge when no merge is provided', async () => {
    localStorage.setItem('counter', JSON.stringify({ state: { count: 7 }, version: 0 }));

    const store = createPersistedStore('counter', createCounterStore, partializeCount);

    await store.persist.rehydrate();

    expect(store.getState().count).toBe(7);
    expect(store.getState().increment).toEqual(expect.any(Function));
    expect(store.persist.hasHydrated()).toBe(true);
  });

  it('persists the full state when partialize is omitted', () => {
    const store = createPersistedStore('full-counter', createCounterStore);

    store.getState().setLabel('persisted');

    expect(store.getState().label).toBe('persisted');
    expect(readStoredState('full-counter')).toMatchObject({
      state: { count: 0, label: 'persisted' },
      version: 0,
    });
  });

  it('uses a custom merge when provided', async () => {
    localStorage.setItem('merged-counter', JSON.stringify({ state: { count: 3 }, version: 0 }));

    const store = createPersistedStore(
      'merged-counter',
      createCounterStore,
      partializeCount,
      (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<CounterState>),
        label: 'merged',
      })
    );

    await store.persist.rehydrate();

    expect(store.getState().count).toBe(3);
    expect(store.getState().label).toBe('merged');
  });
});
