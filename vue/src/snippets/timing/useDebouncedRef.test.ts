import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, watch } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedRef } from './useDebouncedRef';

const onChange = vi.fn<(q: string) => void>();
const Search = defineComponent(() => {
  const query = useDebouncedRef('', 300);
  watch(query, onChange);
  return () =>
    h('input', { value: query.value, onInput: (e: Event) => (query.value = (e.target as HTMLInputElement).value) });
});

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  onChange.mockReset();
});

describe('useDebouncedRef', () => {
  it('commits only the last write after the input goes quiet', async () => {
    const wrapper = mount(Search);
    for (const q of ['v', 'vu', 'vue']) {
      await wrapper.get('input').setValue(q);
      vi.advanceTimersByTime(100);
    }
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('vue', '', expect.anything());
  });

  it('clears the pending timer on unmount', async () => {
    const wrapper = mount(Search);
    await wrapper.get('input').setValue('x');
    expect(vi.getTimerCount()).toBe(1);
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
