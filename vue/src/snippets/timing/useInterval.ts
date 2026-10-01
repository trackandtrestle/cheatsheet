import { onWatcherCleanup, toValue, watch, type MaybeRefOrGetter } from 'vue';

// Declarative interval: `null` pauses, a new delay restarts it, unmount stops it.
// The callback runs in setup's closure and reads reactive state live — no stale values.
export function useInterval(callback: () => void, delay: MaybeRefOrGetter<number | null>): void {
  watch(
    () => toValue(delay),
    (ms) => {
      if (ms === null) return;
      const id = setInterval(callback, ms);
      // Called before the next run (delay changed) and when the scope is disposed.
      onWatcherCleanup(() => clearInterval(id));
    },
    { immediate: true },
  );
}
