import { describe, expect, expectTypeOf, it } from 'vitest';
import type { Ref } from 'vue';
import { useCounter } from './useCounter';

describe('typing composable return values', () => {
  it('exposes readonly refs + actions, destructurable without losing reactivity', () => {
    const { count, isMax, inc, reset } = useCounter(1, { max: 3 });
    expectTypeOf(count).toEqualTypeOf<Readonly<Ref<number>>>();

    inc(5);
    expect(count.value).toBe(3);
    expect(isMax.value).toBe(true);
    reset();
    expect(count.value).toBe(1);
    expect(isMax.value).toBe(false);
  });

  it('rejects writes from the outside', () => {
    const { count } = useCounter();
    // @ts-expect-error value is readonly for consumers
    count.value = 10;
    expect(count.value).toBe(0); // the readonly proxy also blocks it at runtime (with a dev warning)
  });
});
