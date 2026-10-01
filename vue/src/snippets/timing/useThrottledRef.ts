import { customRef, onScopeDispose, type Ref } from 'vue';

// A writable ref that publishes at most once per `intervalMs`: the first write
// goes through immediately (leading), the latest of a burst lands at the end (trailing).
export function useThrottledRef<T>(initial: T, intervalMs = 200): Ref<T> {
  let value = initial;
  let latest = initial;
  let lastCommit = -Infinity;
  let timer: ReturnType<typeof setTimeout> | undefined;
  onScopeDispose(() => clearTimeout(timer), true);

  return customRef<T>((track, trigger) => {
    const commit = () => {
      timer = undefined;
      lastCommit = Date.now();
      value = latest;
      trigger();
    };
    return {
      get() {
        track();
        return value;
      },
      set(next) {
        latest = next; // the trailing commit always reads the newest write
        const wait = lastCommit + intervalMs - Date.now();
        if (wait <= 0) commit();
        else timer ??= setTimeout(commit, wait);
      },
    };
  });
}
