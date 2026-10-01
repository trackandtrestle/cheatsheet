import { onScopeDispose, readonly, shallowRef, toValue, type MaybeRefOrGetter } from 'vue';

// One-shot timer with imperative controls, e.g. auto-dismissing a toast.
export function useTimeout(callback: () => void, delay: MaybeRefOrGetter<number>) {
  const isPending = shallowRef(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stop = () => {
    clearTimeout(timer);
    isPending.value = false;
  };
  const start = () => {
    stop(); // restarting resets the countdown
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      callback();
    }, toValue(delay)); // delay is read at start time
  };

  onScopeDispose(stop, true);
  return { start, stop, isPending: readonly(isPending) };
}
