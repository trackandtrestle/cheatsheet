import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { refDebounced } from './refDebounced';

function mountProbe() {
  const source = ref('a');
  const Probe = defineComponent(() => {
    const debounced = refDebounced(() => source.value, 300); // ref or getter
    return () => h('output', debounced.value);
  });
  return { wrapper: mount(Probe), source };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('refDebounced', () => {
  it('lags the source until it is quiet for the delay', async () => {
    const { wrapper, source } = mountProbe();
    source.value = 'ab';
    await nextTick();
    vi.advanceTimersByTime(200);
    source.value = 'abc'; // restarts the quiet period
    await nextTick();
    vi.advanceTimersByTime(200);
    await nextTick();
    expect(wrapper.text()).toBe('a');
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(wrapper.text()).toBe('abc');
  });

  it('clears the pending timer on unmount', async () => {
    const { wrapper, source } = mountProbe();
    source.value = 'z';
    await nextTick();
    expect(vi.getTimerCount()).toBe(1);
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
