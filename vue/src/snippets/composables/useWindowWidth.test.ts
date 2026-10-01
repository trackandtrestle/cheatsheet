import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useWindowWidth } from './useWindowWidth';

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

function resizeTo(width: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
  window.dispatchEvent(new Event('resize'));
}

describe('useWindowWidth (anatomy)', () => {
  it('tracks width, accepts a ref input, and is destructurable', async () => {
    resizeTo(500);
    const bp = ref(600);
    const { result, wrapper } = withSetup(() => useWindowWidth(bp));
    const { width, isWide } = result;
    expect(width.value).toBe(500);
    expect(isWide.value).toBe(false);

    resizeTo(900);
    expect(width.value).toBe(900);
    expect(isWide.value).toBe(true);

    bp.value = 1000;
    await nextTick();
    expect(isWide.value).toBe(false);

    wrapper.unmount();
    resizeTo(300);
    expect(width.value).toBe(900); // listener removed on unmount
  });
});
