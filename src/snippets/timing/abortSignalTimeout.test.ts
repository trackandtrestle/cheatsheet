import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { abortKind, fetchWithDeadline } from './abortSignalTimeout';

describe('AbortSignal.timeout / AbortSignal.any', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_url: string, init?: RequestInit) =>
      new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
      }),
    ));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('rejects with a TimeoutError once the deadline passes', async () => {
    const p = fetchWithDeadline('/slow', 1000).catch(abortKind);
    await vi.advanceTimersByTimeAsync(1000);
    await expect(p).resolves.toBe('timeout');
  });

  it('rejects with an AbortError when the user cancels first', async () => {
    const controller = new AbortController();
    const p = fetchWithDeadline('/slow', 1000, controller.signal).catch(abortKind);
    controller.abort();
    await expect(p).resolves.toBe('cancelled');
  });
});
