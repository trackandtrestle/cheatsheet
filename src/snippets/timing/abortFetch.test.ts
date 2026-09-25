import { afterEach, describe, expect, it, vi } from 'vitest';
import { isAbortError, searchUsers } from './abortFetch';

// A fetch mock that never resolves on its own but honours the abort signal, like the real one.
function mockHangingFetch() {
  const fetchMock = vi.fn((_url: string | URL | Request, init?: RequestInit) =>
    new Promise<Response>((_, reject) => {
      init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
    }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('AbortController + fetch', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('passes the signal to fetch and rejects with an AbortError on abort', async () => {
    const fetchMock = mockHangingFetch();
    const { result, abort } = searchUsers('ada lovelace');
    expect(fetchMock).toHaveBeenCalledWith('/api/users?q=ada%20lovelace', expect.objectContaining({ signal: expect.any(AbortSignal) }));
    abort();
    const error = await result.catch((e: unknown) => e);
    expect(isAbortError(error)).toBe(true);
  });

  it('resolves normally when not aborted', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(['Ada'])));
    await expect(searchUsers('a').result).resolves.toEqual(['Ada']);
  });

  it('isAbortError distinguishes cancellation from real failures', () => {
    expect(isAbortError(new DOMException('x', 'AbortError'))).toBe(true);
    expect(isAbortError(new Error('HTTP 500'))).toBe(false);
  });
});
