import { executeRegex } from './utils';

export interface RegexWorkerRequest {
  id: number;
  pattern: string;
  flags: string;
  testText: string;
  maxMatches?: number;
  replacement?: string;
}

addEventListener('message', (event: MessageEvent<RegexWorkerRequest>) => {
  try {
    const { id, pattern, flags, testText, maxMatches, replacement } = event.data;
    const result = executeRegex(pattern, flags, testText, maxMatches, replacement);
    postMessage({ id, result });
  } catch (err) {
    postMessage({
      id: event.data?.id,
      result: {
        isValid: false,
        error: err instanceof Error ? err.message : 'Worker execution error',
        matches: [],
      },
    });
  }
});
