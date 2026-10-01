import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInterval } from './useInterval';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function mountTicker(initialDelay: number | null) {
  const delay = ref<number | null>(initialDelay);
  const count = shallowRef(0);
  const wrapper = mount(
    defineComponent(() => {
      useInterval(() => count.value++, delay); // reads the live count every tick
      return () => h('output', String(count.value));
    }),
  );
  return { wrapper, delay, count };
}

describe('useInterval', () => {
  it('ticks every delay and never gets stuck on a stale value', () => {
    const { count } = mountTicker(100);
    vi.advanceTimersByTime(350);
    expect(count.value).toBe(3);
  });

  it('pauses on null and restarts with a new delay', async () => {
    const { delay, count } = mountTicker(100);
    vi.advanceTimersByTime(100);
    delay.value = null;
    await nextTick(); // watchers flush before the next tick
    vi.advanceTimersByTime(1000);
    expect(count.value).toBe(1);
    delay.value = 500;
    await nextTick();
    vi.advanceTimersByTime(1000);
    expect(count.value).toBe(3);
  });

  it('clears the interval on unmount', () => {
    const { wrapper, count } = mountTicker(100);
    expect(vi.getTimerCount()).toBe(1);
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(1000);
    expect(count.value).toBe(0);
  });
});
