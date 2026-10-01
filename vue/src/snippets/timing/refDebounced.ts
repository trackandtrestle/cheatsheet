import { onWatcherCleanup, shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue';

// A read-only ref that follows `source` once it has been stable for `delayMs`.
// The source stays instant (e.g. the input), only derived work is debounced.
export function refDebounced<T>(source: MaybeRefOrGetter<T>, delayMs = 300): Readonly<Ref<T>> {
  const debounced = shallowRef(toValue(source));

  watch(
    () => toValue(source),
    (value) => {
      const timer = setTimeout(() => (debounced.value = value), delayMs);
      // Runs before the next change AND when the watcher stops (unmount).
      onWatcherCleanup(() => clearTimeout(timer));
    },
  );

  return debounced;
}
