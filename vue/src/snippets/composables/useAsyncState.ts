import { shallowRef } from 'vue';

/** loading/error/data around an async fn; only the latest call may write. */
export function useAsyncState<T, Args extends unknown[]>(fn: (...args: Args) => Promise<T>) {
  const data = shallowRef<T>();
  const error = shallowRef<Error>();
  const loading = shallowRef(false);
  let latest = 0;

  async function execute(...args: Args): Promise<T | undefined> {
    const id = ++latest;
    loading.value = true;
    error.value = undefined;
    try {
      const result = await fn(...args);
      if (id === latest) data.value = result;
      return result;
    } catch (err) {
      if (id === latest) error.value = err instanceof Error ? err : new Error(String(err));
      return undefined;
    } finally {
      if (id === latest) loading.value = false;
    }
  }

  return { data, error, loading, execute };
}
