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
      },
    } as MessageEvent);

    expect(postMessageSpy).toHaveBeenCalledWith({
      id: 42,
      result: expect.objectContaining({
        isValid: true,
        matches: expect.any(Array),
      }),
    });

    // 2. Exception handling with Error instance
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

    // 3. Exception handling with non-Error thrown
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
