import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, type Ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useThrottledRef } from './useThrottledRef';

beforeEach(() => vi.useFakeTimers()); // also fakes Date.now()
afterEach(() => vi.useRealTimers());

function mountProbe() {
  let y!: Ref<number>;
  const renders = vi.fn<(v: number) => void>();
  const wrapper = mount(
    defineComponent(() => {
      y = useThrottledRef(0, 200);
      return () => (renders(y.value), h('output', String(y.value)));
    }),
  );
  return { wrapper, y: () => y, renders };
}

describe('useThrottledRef', () => {
  it('passes the leading write, then the latest at the end of the window', async () => {
    const { wrapper, y } = mountProbe();
    y().value = 1; // leading: immediate
    await nextTick();
    expect(wrapper.text()).toBe('1');
    for (const v of [2, 3, 4]) {
      vi.advanceTimersByTime(50);
      y().value = v;
    }
    await nextTick();
    expect(wrapper.text()).toBe('1');
    vi.advanceTimersByTime(50); // 200 ms since the leading commit
    await nextTick();
    expect(wrapper.text()).toBe('4');
  });

  it('drops the trailing commit on unmount', () => {
    const { wrapper, y, renders } = mountProbe();
    y().value = 1;
    y().value = 2;
    expect(vi.getTimerCount()).toBe(1);
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
    renders.mockClear();
    vi.runAllTimers();
    expect(renders).not.toHaveBeenCalled();
  });
});
