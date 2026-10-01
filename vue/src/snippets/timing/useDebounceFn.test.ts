import { mount } from '@vue/test-utils';
import { defineComponent, effectScope, h } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounceFn, type DebouncedFn } from './useDebounceFn';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function mountWith(save: (text: string) => void) {
  let api!: DebouncedFn<[string]>;
  const wrapper = mount(
    defineComponent(() => {
      api = useDebounceFn(save, 300);
      return () => h('div');
    }),
  );
  return { wrapper, api };
}

describe('useDebounceFn', () => {
  it('calls once with the latest args after the quiet period', () => {
    const save = vi.fn<(text: string) => void>();
    const { api } = mountWith(save);
    api('a');
    vi.advanceTimersByTime(200);
    api('ab');
    vi.advanceTimersByTime(299);
    expect(save).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(save).toHaveBeenCalledExactlyOnceWith('ab');
  });

  it('flush() runs now, cancel() drops the call', () => {
    const save = vi.fn<(text: string) => void>();
    const { api } = mountWith(save);
    api('x');
    api.flush();
    expect(save).toHaveBeenCalledExactlyOnceWith('x');
    api('y');
    api.cancel();
    vi.runAllTimers();
    expect(save).toHaveBeenCalledTimes(1);
    api.flush(); // nothing pending -> no-op
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('auto-cancels when the component unmounts or the scope stops', () => {
    const save = vi.fn<(text: string) => void>();
    const { wrapper, api } = mountWith(save);
    api('late');
    wrapper.unmount();
    vi.runAllTimers();
    expect(save).not.toHaveBeenCalled();

    const scope = effectScope();
    const fn = scope.run(() => useDebounceFn(save, 100));
    fn?.('also late');
    scope.stop();
    vi.runAllTimers();
    expect(save).not.toHaveBeenCalled();
  });
});
