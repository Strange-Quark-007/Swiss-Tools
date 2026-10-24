import { describe, expect, it, vi } from 'vitest';

describe('regex-worker.ts', () => {
  it('should listen to messages and post execution result back', async () => {
    let messageListener: ((event: MessageEvent) => void) | undefined;
    const postMessageSpy = vi.fn();

    vi.stubGlobal('addEventListener', (type: string, listener: (event: MessageEvent) => void) => {
      if (type === 'message') {
        messageListener = listener;
      }
    });
    vi.stubGlobal('postMessage', postMessageSpy);

    // Dynamically import worker file so it registers listener with our stubbed globals
    await import('../regex-worker');

    expect(messageListener).toBeDefined();

    // 1. Valid execution
    messageListener!({
      data: {
        id: 42,
        pattern: 'foo',
        flags: 'g',
        testText: 'foo bar foo',
        maxMatches: 10,
        replacement: 'baz',
      },
    } as MessageEvent);

    expect(postMessageSpy).toHaveBeenCalledWith({
      id: 42,
      result: expect.objectContaining({
        isValid: true,
        matches: expect.any(Array),
        replacedText: 'baz bar baz',
      }),
    });

    // 2. Empty replacement removes matches
    postMessageSpy.mockClear();
    messageListener!({
      data: {
        id: 43,
        pattern: 'foo',
        flags: 'g',
        testText: 'foo bar foo',
        maxMatches: 10,
        replacement: '',
      },
    } as MessageEvent);

    expect(postMessageSpy).toHaveBeenCalledWith({
      id: 43,
      result: expect.objectContaining({
        isValid: true,
        replacedText: ' bar ',
      }),
    });

    // 3. Exception handling with Error instance
    postMessageSpy.mockClear();
    messageListener!({
      data: null as unknown,
    } as MessageEvent);

    expect(postMessageSpy).toHaveBeenCalledWith({
      id: undefined,
      result: expect.objectContaining({
        isValid: false,
        error: expect.any(String),
      }),
    });

    // 4. Exception handling with non-Error thrown
    postMessageSpy.mockClear();
    messageListener!({
      data: {
        id: 7,
        get pattern(): string {
          throw 'string-error';
        },
        flags: 'g',
        testText: 'test',
      },
    } as MessageEvent);

    expect(postMessageSpy).toHaveBeenCalledWith({
      id: 7,
      result: expect.objectContaining({
        isValid: false,
        error: 'Worker execution error',
      }),
    });

    vi.unstubAllGlobals();
  });
});
