import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref, useTemplateRef } from 'vue';
import { mount } from '@vue/test-utils';
import { useEventListener } from './useEventListener';

describe('useEventListener', () => {
  it('binds to window and unbinds on unmount', () => {
    const onKey = vi.fn();
    const wrapper = mount(defineComponent({
      setup() {
        useEventListener(window, 'keydown', (e) => onKey(e.key));
        return () => null;
      },
    }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    wrapper.unmount();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    expect(onKey.mock.calls).toEqual([['a']]);
  });

  it('re-binds when a template-ref target changes', async () => {
    const onClick = vi.fn();
    const which = ref<'a' | 'b'>('a');
    const wrapper = mount(defineComponent({
      setup() {
        const btn = useTemplateRef<HTMLButtonElement>('btn');
        useEventListener(btn, 'click', () => onClick(which.value));
        return () => h('div', [
          which.value === 'a' ? h('button', { ref: 'btn', key: 'a', id: 'a' }) : h('button', { ref: 'btn', key: 'b', id: 'b' }),
        ]);
      },
    }));
    await nextTick();
    const first = wrapper.get('#a').element;
    await wrapper.get('#a').trigger('click');

    which.value = 'b';
    await nextTick();
    await nextTick();
    first.dispatchEvent(new MouseEvent('click')); // old element: unbound
    await wrapper.get('#b').trigger('click');
    expect(onClick.mock.calls).toEqual([['a'], ['b']]);
  });

  it('returns a manual stop', () => {
    const onResize = vi.fn();
    const wrapper = mount(defineComponent({
      setup() {
        const stop = useEventListener(() => window, 'resize', onResize);
        stop();
        return () => null;
      },
    }));
    window.dispatchEvent(new Event('resize'));
    expect(onResize).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
