import { readonly, shallowRef } from 'vue';

export interface CounterOptions {
  min?: number;
  max?: number;
}

export function useCounter(initial = 0, { min = -Infinity, max = Infinity }: CounterOptions = {}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const count = shallowRef(clamp(initial));

  return {
    count: readonly(count), // only the methods below may change it
    atMin: () => count.value <= min,
    atMax: () => count.value >= max,
    inc: (step = 1) => void (count.value = clamp(count.value + step)),
    dec: (step = 1) => void (count.value = clamp(count.value - step)),
    set: (n: number) => void (count.value = clamp(n)),
    reset: () => void (count.value = clamp(initial)),
  };
}
