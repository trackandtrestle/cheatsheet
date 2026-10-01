import { customRef, onScopeDispose, type Ref } from 'vue';

// A writable ref whose *reads* lag behind writes until they stop for `delayMs`.
// Bind it with v-model and anything that reads it (watchers, fetches) is debounced.
export function useDebouncedRef<T>(initial: T, delayMs = 300): Ref<T> {
  let value = initial;
  let timer: ReturnType<typeof setTimeout> | undefined;
  // `true` = fail silently when called outside a component / effectScope.
  onScopeDispose(() => clearTimeout(timer), true);

  return customRef<T>((track, trigger) => ({
    get() {
      track(); // register the reading effect as a dependency
      return value;
    },
    set(next) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        value = next;
        trigger(); // re-run dependents only once the input is quiet
      }, delayMs);
    },
  }));
}
