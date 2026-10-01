import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { useLatestFetch } from './useLatestFetch';

function setup() {
  const userId = ref(1);
  const pending = new Map<number, PromiseWithResolvers<string>>();
  const signals = new Map<number, AbortSignal>();
  const load = vi.fn((id: number, signal: AbortSignal) => {
    const deferred = Promise.withResolvers<string>();
    pending.set(id, deferred);
    signals.set(id, signal);
    return deferred.promise; // ignores the signal on purpose: the guard must still hold
  });
  const wrapper = mount(
    defineComponent(() => {
      const { data, loading } = useLatestFetch(userId, load);
      return () => h('output', loading.value ? 'loading' : (data.value ?? ''));
    }),
  );
  return { wrapper, userId, pending, signals };
}

describe('useLatestFetch', () => {
  it('never lets a stale response overwrite a newer one', async () => {
    const { wrapper, userId, pending, signals } = setup();
    userId.value = 2;
    await nextTick();
    expect(signals.get(1)?.aborted).toBe(true);

    pending.get(2)?.resolve('user 2');
    await flushPromises();
    expect(wrapper.text()).toBe('user 2');

    pending.get(1)?.resolve('user 1'); // slow, stale response arrives last
    await flushPromises();
    expect(wrapper.text()).toBe('user 2');
  });

  it('aborts the in-flight request on unmount', async () => {
    const { wrapper, signals } = setup();
    wrapper.unmount();
    expect(signals.get(1)?.aborted).toBe(true);
  });
});
