import { customRef } from 'vue';

// customRef: you decide when to track reads and trigger updates.
export function clampedRef(initial: number, min: number, max: number) {
  const clamp = (n: number) => (Number.isNaN(n) ? min : Math.min(max, Math.max(min, n)));
  let value = clamp(initial);

  return customRef<number>((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(next) {
      const clamped = clamp(next);
      // Also trigger when the input was rejected (clamped === value but next !== value),
      // so a bound <input v-model.number> re-renders and snaps back to the clamped value.
      if (clamped === value && next === value) return;
      value = clamped;
      trigger();
    },
  }));
}
