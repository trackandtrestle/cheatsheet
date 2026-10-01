import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useNow } from './useNow';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
});
afterEach(() => vi.useRealTimers());

const Clock = defineComponent(() => {
  const now = useNow(1000);
  return () => h('time', now.value.toISOString());
});

describe('useNow', () => {
  it('re-renders with the current time every interval', async () => {
    const wrapper = mount(Clock);
    expect(wrapper.text()).toBe('2026-01-01T00:00:00.000Z');
    vi.advanceTimersByTime(3000);
    await nextTick();
    expect(wrapper.text()).toBe('2026-01-01T00:00:03.000Z');
  });

  it('stops ticking after unmount', () => {
    const wrapper = mount(Clock);
    expect(vi.getTimerCount()).toBe(1);
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
