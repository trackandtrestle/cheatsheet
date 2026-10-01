import { onWatcherCleanup, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';

// Refetch whenever `key` changes; a slower, older response can never win.
export function useLatestFetch<K, T>(
  key: MaybeRefOrGetter<K>,
  load: (key: K, signal: AbortSignal) => Promise<T>,
) {
  const data = shallowRef<T>();
  const error = shallowRef<unknown>();
  const loading = shallowRef(false);

  watch(
    () => toValue(key),
    async (k) => {
      const controller = new AbortController();
      // Must be registered synchronously — after an `await` Vue no longer
      // knows which watcher is running and the cleanup is lost.
      onWatcherCleanup(() => controller.abort());
      loading.value = true;
      error.value = undefined;
      try {
        const result = await load(k, controller.signal);
        if (!controller.signal.aborted) data.value = result;
      } catch (e) {
        if (!controller.signal.aborted) error.value = e;
      } finally {
        if (!controller.signal.aborted) loading.value = false;
      }
    },
    { immediate: true },
  );

  return { data, error, loading };
}
