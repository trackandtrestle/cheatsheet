import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useLocalStorage } from './useLocalStorage';

function withSetup<T>(composable: () => T) {
  let result!: T;
  const wrapper = mount(defineComponent({
    setup() {
      result = composable();
      return () => null;
    },
  }));
  return { result, wrapper };
}

afterEach(() => localStorage.clear());

describe('useLocalStorage', () => {
  it('uses the initial value, then writes back deep changes', async () => {
    const { result: prefs } = withSetup(() => useLocalStorage('prefs', { name: 'Ada', tags: ['x'] }));
    expect(prefs.value.name).toBe('Ada');
    prefs.value.tags.push('y');
    await nextTick();
    expect(JSON.parse(localStorage.getItem('prefs') ?? 'null')).toEqual({ name: 'Ada', tags: ['x', 'y'] });
  });

  it('reads existing JSON and falls back on corrupt JSON', () => {
    localStorage.setItem('n', '42');
    localStorage.setItem('bad', '{oops');
    const { result } = withSetup(() => [useLocalStorage('n', 0), useLocalStorage('bad', 'fallback')] as const);
    expect(result[0].value).toBe(42);
    expect(result[1].value).toBe('fallback');
  });

  it('syncs from other tabs via the storage event until unmounted', () => {
    const { result: n, wrapper } = withSetup(() => useLocalStorage('n', 0));
    window.dispatchEvent(new StorageEvent('storage', { key: 'n', newValue: '7' }));
    expect(n.value).toBe(7);
    window.dispatchEvent(new StorageEvent('storage', { key: 'n', newValue: null })); // removed
    expect(n.value).toBe(0);
    wrapper.unmount();
    window.dispatchEvent(new StorageEvent('storage', { key: 'n', newValue: '9' }));
    expect(n.value).toBe(0);
  });
});
