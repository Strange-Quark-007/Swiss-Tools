import { beforeEach, describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';

import {
  createBaseConverterStore,
  createPersistedStore,
  createRoutePersistedStore,
  StoreCreator,
} from '../store-factory';

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

  it('creates a persisted store via createRoutePersistedStore', () => {
    const store = createRoutePersistedStore(ROUTES.CASE_CONVERTER, createBaseConverterStore, (state) => ({
      auto: state.auto,
    }));

    expect(store.getState().fromValue).toBe('');
  });
});

describe('createBaseConverterStore', () => {
  it('creates base converter state with all standard slices including ingest', () => {
    let state = {} as ReturnType<typeof createBaseConverterStore<string, never>>;
    const set = (updater: unknown) => {
      state =
        typeof updater === 'function'
          ? (updater as (s: unknown) => typeof state)(state)
          : { ...state, ...(updater as object) };
    };

    state = createBaseConverterStore<string, typeof state>(set);
    expect(state.fromValue).toBe('');
    expect(state.toValue).toBe('');
    expect(state.auto).toBe(true);

    state.setFromValue('hello');
    expect(state.fromValue).toBe('hello');

    state.ingest('transferred');
    expect(state.fromValue).toBe('transferred');
  });
});
