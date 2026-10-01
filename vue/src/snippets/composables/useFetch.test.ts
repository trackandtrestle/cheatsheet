import { describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { useFetch } from './useFetch';

function withSetup<T>(composable: () => T) {
  let result!: T;
  const wrapper = mount(defineComponent({
    setup() {
      result = composable();
      return () => null;
    },
  }));
  return { result, wrapper };
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const parseName = (j: unknown) => {
  if (typeof j === 'object' && j !== null && 'name' in j && typeof j.name === 'string') return j.name;
  throw new Error('Invalid payload');
};

describe('useFetch', () => {
  it('goes loading -> success, and refetch re-runs', async () => {
    const fetcher = vi.fn(async () => json({ name: 'Ada' }));
    const { result } = withSetup(() => useFetch('/u/1', parseName, fetcher));
    expect(result.state.value).toEqual({ status: 'loading' });
    await flushPromises();
    expect(result.state.value).toEqual({ status: 'success', data: 'Ada' });
    result.refetch();
    await flushPromises();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('reports HTTP and validation errors', async () => {
    const { result: a } = withSetup(() => useFetch('/x', parseName, async () => json({}, 500)));
    const { result: b } = withSetup(() => useFetch('/x', parseName, async () => json({ nope: 1 })));
    await flushPromises();
    expect(a.state.value).toMatchObject({ status: 'error', error: { message: 'HTTP 500' } });
    expect(b.state.value).toMatchObject({ status: 'error', error: { message: 'Invalid payload' } });
  });

  it('aborts the stale request when the url changes; null means idle', async () => {
    const signals: AbortSignal[] = [];
    const fetcher = vi.fn((input: string, init: { signal: AbortSignal }) => {
      signals.push(init.signal);
      return Promise.resolve(json({ name: input }));
    });
    const url = ref<string | null>('/a');
    const { result } = withSetup(() => useFetch(url, parseName, fetcher));
    url.value = '/b';
    await flushPromises();
    expect(signals[0]?.aborted).toBe(true);
    expect(result.state.value).toEqual({ status: 'success', data: '/b' });
    url.value = null;
    await flushPromises();
    expect(result.state.value).toEqual({ status: 'idle' });
  });

  it('aborts in-flight requests on unmount', async () => {
    let signal: AbortSignal | undefined;
    const fetcher = (_: string, init: { signal: AbortSignal }) => {
      signal = init.signal;
      return new Promise<Response>(() => {});
    };
    const { wrapper } = withSetup(() => useFetch('/slow', parseName, fetcher));
    wrapper.unmount();
    expect(signal?.aborted).toBe(true);
  });
});
