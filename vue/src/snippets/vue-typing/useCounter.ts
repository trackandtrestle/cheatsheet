import { computed, readonly, ref, type ComputedRef, type Ref } from 'vue';

// An explicit return interface is the composable's contract: callers (and the
// .d.ts) see readonly refs instead of a leaked, writable implementation detail.
export interface UseCounterReturn {
  count: Readonly<Ref<number>>;
  isMax: ComputedRef<boolean>;
  inc: (by?: number) => void;
  reset: () => void;
}

export function useCounter(initial = 0, { max = Infinity }: { max?: number } = {}): UseCounterReturn {
  const count = ref(initial);
  const isMax = computed(() => count.value >= max);

  return {
    count: readonly(count),
    isMax,
    inc: (by = 1) => {
      count.value = Math.min(max, count.value + by);
    },
    reset: () => {
      count.value = initial;
    },
  };
}
// Return an object of refs (not reactive()) so `const { count } = useCounter()` stays reactive.
