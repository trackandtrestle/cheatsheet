import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useTitle } from './useTitle';

describe('useTitle', () => {
  it('syncs a getter to document.title and restores it on unmount', async () => {
    document.title = 'App';
    const unread = ref(0);
    const wrapper = mount(defineComponent({
      setup() {
        useTitle(() => (unread.value ? `(${unread.value}) Inbox` : 'Inbox'));
        return () => null;
      },
    }));
    expect(document.title).toBe('Inbox');
    unread.value = 3;
    await nextTick();
    expect(document.title).toBe('(3) Inbox');
    wrapper.unmount();
    expect(document.title).toBe('App');
  });
});
