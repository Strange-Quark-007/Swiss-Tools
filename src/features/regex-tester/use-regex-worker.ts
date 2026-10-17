import { useEffect, useEffectEvent, useRef } from 'react';
import { toast } from 'sonner';

import { useT } from '@/i18n/utils';

import { executeRegex, RegexExecutionResult } from './utils';

export interface RegexWorkerResponse {
  id: number;
  result: RegexExecutionResult;
}

const WORKER_TIMEOUT_MS = 1500;

export function useRegexWorker() {
  const { t } = useT();
  const workerRef = useRef<Worker | null>(null);
  const currentRequestIdRef = useRef(0);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingResolveRef = useRef<((result: RegexExecutionResult) => void) | null>(null);

  const clearTimeoutRef = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const terminateWorker = () => {
    clearTimeoutRef();
    // Resolve any pending execution promise with an invalid/empty result before terminating worker
    // to cleanly settle in-flight async calls without leaving unhandled rejections.
    if (pendingResolveRef.current) {
      pendingResolveRef.current({
        isValid: false,
        matches: [],
      });
      pendingResolveRef.current = null;
    }
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  };

  const onUnmount = useEffectEvent(() => {
    terminateWorker();
  });

  useEffect(() => {
    return () => {
      onUnmount();
    };
  }, []);

  const runRegex = (
    pattern: string,
    flags: string,
    testText: string,
    maxMatches?: number
  ): Promise<RegexExecutionResult> => {
    if (!pattern || !testText) {
      return Promise.resolve({
        isValid: true,
        matches: [],
      });
    }

    // If Web Worker is not supported in the current environment (e.g. SSR, test environments), fall back to sync execution
    if (typeof Worker === 'undefined') {
      return Promise.resolve(executeRegex(pattern, flags, testText, maxMatches));
    }

    currentRequestIdRef.current += 1;
    const requestId = currentRequestIdRef.current;

    // If an execution is still in flight, terminate runaway/stale task and settle pending promise
    if (pendingResolveRef.current) {
      terminateWorker();
    }

    return new Promise((resolve) => {
      pendingResolveRef.current = resolve;

      const safeResolve = (res: RegexExecutionResult) => {
        clearTimeoutRef();
        pendingResolveRef.current = null;
        resolve(res);
      };

      let worker: Worker;
      if (workerRef.current) {
        worker = workerRef.current;
      } else {
        try {
          worker = new Worker(new URL('./regex-worker.ts', import.meta.url));
          workerRef.current = worker;
        } catch {
          safeResolve(executeRegex(pattern, flags, testText, maxMatches));
          return;
        }
      }

      timeoutIdRef.current = setTimeout(() => {
        const errorMsg = t('regexTester.executionTimeout');
        toast.error(errorMsg);
        safeResolve({
          isValid: false,
          error: errorMsg,
          matches: [],
        });
        workerRef.current?.terminate();
        workerRef.current = null;
      }, WORKER_TIMEOUT_MS);

      worker.onmessage = (e: MessageEvent<RegexWorkerResponse>) => {
        if (e.data.id === requestId) {
          safeResolve(e.data.result);
        }
      };

      worker.onerror = () => {
        if (!pendingResolveRef.current) return;
        workerRef.current?.terminate();
        workerRef.current = null;
        const errorMsg = t('regexTester.workerError');
        toast.error(errorMsg);
        safeResolve({
          isValid: false,
          error: errorMsg,
          matches: [],
        });
      };

      worker.postMessage({ id: requestId, pattern, flags, testText, maxMatches });
    });
  };

  return { runRegex };
}
