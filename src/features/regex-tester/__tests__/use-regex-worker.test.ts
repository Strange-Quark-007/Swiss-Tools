import { renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { useRegexWorker } from '../use-regex-worker';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useRegexWorker', () => {
  const originalWorker = globalThis.Worker;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    globalThis.Worker = originalWorker;
  });

  it('should immediately resolve with empty matches if pattern or testText is empty without spawning worker', async () => {
    const workerConstructorMock = vi.fn();

    globalThis.Worker = workerConstructorMock;

    const { result } = renderHook(() => useRegexWorker());
    const resEmptyPattern = await result.current.runRegex('', 'g', 'foo');
    expect(resEmptyPattern.isValid).toBe(true);
    expect(resEmptyPattern.matches).toEqual([]);

    const resEmptyText = await result.current.runRegex('foo', 'g', '');
    expect(resEmptyText.isValid).toBe(true);
    expect(resEmptyText.matches).toEqual([]);

    expect(workerConstructorMock).not.toHaveBeenCalled();
  });

  it('should fallback to sync execution when Worker is undefined', async () => {
    // @ts-expect-error simulating environment without Worker
    delete globalThis.Worker;

    const { result } = renderHook(() => useRegexWorker());
    const res = await result.current.runRegex('foo', 'g', 'foo bar foo');

    expect(res.isValid).toBe(true);
    expect(res.matches).toHaveLength(2);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should run execution via Worker when Worker is available', async () => {
    class MockWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      terminate = vi.fn();

      postMessage(data: { id: number; pattern: string; flags: string; testText: string }) {
        setTimeout(() => {
          this.onmessage?.({
            data: {
              id: data.id,
              result: {
                isValid: true,
                matches: [{ match: 'hello', index: 0, end: 5, groups: [] }],
              },
            },
          } as MessageEvent);
        }, 10);
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = MockWorker;

    const { result } = renderHook(() => useRegexWorker());
    const res = await result.current.runRegex('hello', 'g', 'hello world');

    expect(res.isValid).toBe(true);
    expect(res.matches).toHaveLength(1);
    expect(res.matches[0].match).toBe('hello');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should terminate worker and return timeout error with toast if execution exceeds limit', async () => {
    vi.useFakeTimers();

    const terminateMock = vi.fn();

    class HangingWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      terminate = terminateMock;

      postMessage() {
        // Does not respond
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = HangingWorker;

    const { result } = renderHook(() => useRegexWorker());
    const promise = result.current.runRegex('(a+)+$', '', 'aaaaaaaaaaaa!');

    vi.advanceTimersByTime(1600);

    const res = await promise;

    expect(terminateMock).toHaveBeenCalled();
    expect(res.isValid).toBe(false);
    expect(res.error).toBe(testT('regexTester.executionTimeout'));
    expect(res.matches).toHaveLength(0);
    expect(toast.error).toHaveBeenCalledWith(testT('regexTester.executionTimeout'));

    vi.useRealTimers();
  });

  it('should not emit duplicate workerError toast if onerror is dispatched after timeout termination', async () => {
    vi.useFakeTimers();

    const terminateMock = vi.fn();

    class TimeoutAndErrorWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      isTerminated = false;
      terminate = vi.fn(() => {
        if (!this.isTerminated) {
          this.isTerminated = true;
          this.onerror?.(new Event('error') as ErrorEvent);
        }
        terminateMock();
      });

      postMessage() {
        // Does not respond
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = TimeoutAndErrorWorker;

    const { result } = renderHook(() => useRegexWorker());
    const promise = result.current.runRegex('(a+)+$', '', 'aaaaaaaaaaaa!');

    vi.advanceTimersByTime(1600);

    const res = await promise;

    expect(terminateMock).toHaveBeenCalled();
    expect(res.isValid).toBe(false);
    expect(res.error).toBe(testT('regexTester.executionTimeout'));
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(testT('regexTester.executionTimeout'));
    expect(toast.error).not.toHaveBeenCalledWith(testT('regexTester.workerError'));

    vi.useRealTimers();
  });

  it('should handle worker error event gracefully and trigger toast', async () => {
    class FailingWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      terminate = vi.fn();

      postMessage() {
        setTimeout(() => {
          this.onerror?.(new Event('error') as ErrorEvent);
        }, 10);
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = FailingWorker;

    const { result } = renderHook(() => useRegexWorker());
    const res = await result.current.runRegex('pattern', '', 'test');

    expect(res.isValid).toBe(false);
    expect(res.error).toBe(testT('regexTester.workerError'));
    expect(toast.error).toHaveBeenCalledWith(testT('regexTester.workerError'));
  });

  it('should not show toast on normal worker execution even if result is invalid (inline error handles it)', async () => {
    class ErrorResultWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      terminate = vi.fn();

      postMessage(data: { id: number }) {
        setTimeout(() => {
          this.onmessage?.({
            data: {
              id: data.id,
              result: {
                isValid: false,
                error: 'Invalid regex',
                matches: [],
              },
            },
          } as MessageEvent);
        }, 10);
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = ErrorResultWorker;

    const { result } = renderHook(() => useRegexWorker());
    const res = await result.current.runRegex('abc', '', 'def');

    expect(res.isValid).toBe(false);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should fallback gracefully if Worker constructor throws', async () => {
    class CrashingWorker {
      constructor() {
        throw new Error('Worker disabled by policy');
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = CrashingWorker;

    const { result } = renderHook(() => useRegexWorker());
    const res = await result.current.runRegex('abc', 'g', 'abc');

    expect(res.isValid).toBe(true);
    expect(res.matches).toHaveLength(1);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should terminate existing worker and clear timers on unmount', () => {
    const terminateMock = vi.fn();

    class IdleWorker {
      terminate = terminateMock;
      postMessage() {}
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = IdleWorker;

    const { result, unmount } = renderHook(() => useRegexWorker());
    result.current.runRegex('foo', 'g', 'foo');

    unmount();

    expect(terminateMock).toHaveBeenCalled();
  });

  it('should settle pending promise when unmounted while worker is running', async () => {
    class HangingWorker {
      terminate = vi.fn();
      postMessage() {}
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = HangingWorker;

    const { result, unmount } = renderHook(() => useRegexWorker());
    const promise = result.current.runRegex('foo', 'g', 'foo');

    unmount();

    const res = await promise;
    expect(res.isValid).toBe(false);
  });

  it('should ignore messages with mismatched requestId', async () => {
    class StaleWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      terminate = vi.fn();

      postMessage(data: { id: number }) {
        // Send mismatched id first (should be ignored)
        this.onmessage?.({
          data: {
            id: 9999,
            result: { isValid: false, matches: [] },
          },
        } as MessageEvent);

        // Then send matching id
        this.onmessage?.({
          data: {
            id: data.id,
            result: {
              isValid: true,
              matches: [{ match: 'foo', index: 0, end: 3, groups: [] }],
            },
          },
        } as MessageEvent);
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = StaleWorker;

    const { result } = renderHook(() => useRegexWorker());
    const res = await result.current.runRegex('foo', 'g', 'foo');

    expect(res.isValid).toBe(true);
    expect(res.matches).toHaveLength(1);
  });

  it('should handle timeout and onerror even if timeoutId is already cleared or worker is null', async () => {
    class CustomWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      terminate = vi.fn();

      postMessage() {
        this.onerror?.(new Event('error') as ErrorEvent);
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = CustomWorker;

    const { result } = renderHook(() => useRegexWorker());
    const res = await result.current.runRegex('foo', 'g', 'foo');

    expect(res.isValid).toBe(false);
  });

  it('should reuse existing worker across consecutive executions', async () => {
    class ReusableWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      terminate = vi.fn();

      postMessage(data: { id: number }) {
        setTimeout(() => {
          this.onmessage?.({
            data: {
              id: data.id,
              result: { isValid: true, matches: [] },
            },
          } as MessageEvent);
        }, 10);
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = ReusableWorker;

    const { result } = renderHook(() => useRegexWorker());
    const res1 = await result.current.runRegex('first', 'g', 'first');
    expect(res1.isValid).toBe(true);

    const res2 = await result.current.runRegex('second', 'g', 'second');
    expect(res2.isValid).toBe(true);
  });

  it('should terminate existing worker and abort previous task when a new execution starts while in flight', async () => {
    const terminateMock = vi.fn();

    class SlowWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      terminate = terminateMock;

      postMessage(data: { id: number }) {
        if (data.id === 2) {
          setTimeout(() => {
            this.onmessage?.({
              data: {
                id: data.id,
                result: { isValid: true, matches: [] },
              },
            } as MessageEvent);
          }, 10);
        }
      }
    }

    // @ts-expect-error mocking Worker
    globalThis.Worker = SlowWorker;

    const { result } = renderHook(() => useRegexWorker());
    const promise1 = result.current.runRegex('slow', 'g', 'slow');
    const promise2 = result.current.runRegex('fast', 'g', 'fast');

    const [res1, res2] = await Promise.all([promise1, promise2]);
    expect(terminateMock).toHaveBeenCalled();
    expect(res1.isValid).toBe(false);
    expect(res2.isValid).toBe(true);
  });
});
