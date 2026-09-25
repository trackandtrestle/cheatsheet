import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';

interface User { name: string }
const parseUser = (json: unknown): User => {
  if (typeof json === 'object' && json !== null && 'name' in json && typeof json.name === 'string') {
    return { name: json.name };
  }
  throw new Error('Invalid user');
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('useFetch', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('is idle without a url, then loading -> success', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ name: 'Ada' })));
    const { result, rerender } = renderHook(({ url }) => useFetch(url, parseUser), {
      initialProps: { url: null as string | null },
    });
    expect(result.current).toEqual({ status: 'idle' });

    rerender({ url: '/users/1' });
    expect(result.current).toEqual({ status: 'loading' });
    await waitFor(() => expect(result.current).toEqual({ status: 'success', data: { name: 'Ada' } }));
  });

  it('reports HTTP and validation failures as error state', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => (url === '/500' ? jsonResponse({}, 500) : jsonResponse({}))));
    const { result, rerender } = renderHook(({ url }) => useFetch(url, parseUser), { initialProps: { url: '/500' } });
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.status === 'error' && result.current.error.message).toBe('HTTP 500');

    rerender({ url: '/bad-shape' });
    await waitFor(() => expect(result.current.status === 'error' && result.current.error.message).toBe('Invalid user'));
  });

  it('aborts the previous request when the url changes (no stale overwrite)', async () => {
    const signals: AbortSignal[] = [];
    vi.stubGlobal('fetch', vi.fn((url: string, init: RequestInit) => {
      const signal = init.signal as AbortSignal;
      signals.push(signal);
      if (url === '/slow') {
        return new Promise<Response>((_, reject) => signal.addEventListener('abort', () => reject(signal.reason)));
      }
      return Promise.resolve(jsonResponse({ name: 'Grace' }));
    }));

    const { result, rerender } = renderHook(({ url }) => useFetch(url, parseUser), { initialProps: { url: '/slow' } });
    rerender({ url: '/fast' });

    expect(signals[0]?.aborted).toBe(true);
    await waitFor(() => expect(result.current).toEqual({ status: 'success', data: { name: 'Grace' } }));
  });
});
