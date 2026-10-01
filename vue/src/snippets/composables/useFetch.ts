import { onWatcherCleanup, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';

export type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export type Fetcher = (url: string, init: { signal: AbortSignal }) => Promise<Response>;

export function useFetch<T>(
  url: MaybeRefOrGetter<string | null>,
  parse: (json: unknown) => T, // validate at the boundary (zod's .parse fits here)
  fetcher: Fetcher = (url, init) => fetch(url, init), // injectable for tests
) {
  const state = shallowRef<FetchState<T>>({ status: 'idle' });
  const nonce = ref(0);

  watch([() => toValue(url), nonce], async ([href]) => {
    if (!href) return void (state.value = { status: 'idle' });
    const controller = new AbortController();
    onWatcherCleanup(() => controller.abort()); // must run before the first await
    state.value = { status: 'loading' };
    try {
      const res = await fetcher(href, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = parse(await res.json());
      if (!controller.signal.aborted) state.value = { status: 'success', data };
    } catch (err) {
      if (controller.signal.aborted) return; // superseded or unmounted: stay quiet
      state.value = { status: 'error', error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, { immediate: true });

  return { state, refetch: () => void nonce.value++ };
}
