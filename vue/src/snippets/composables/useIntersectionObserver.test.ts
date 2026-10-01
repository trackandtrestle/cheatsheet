import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, useTemplateRef } from 'vue';
import { mount } from '@vue/test-utils';
import { useIntersectionObserver } from './useIntersectionObserver';

class MockIO {
  static instances: MockIO[] = [];
  observed: Element[] = [];
  disconnected = false;
  constructor(public cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {
    MockIO.instances.push(this);
  }
  observe(el: Element) {
    this.observed.push(el);
  }
  disconnect() {
    this.disconnected = true;
  }
  fire(isIntersecting: boolean) {
    this.cb([{ isIntersecting, target: this.observed[0] }]);
  }
}

beforeEach(() => vi.stubGlobal('IntersectionObserver', MockIO));
afterEach(() => {
  vi.unstubAllGlobals();
  MockIO.instances = [];
});

describe('useIntersectionObserver', () => {
  it('observes the template ref, tracks visibility and disconnects on unmount', async () => {
    let visible = (): boolean => false;
    const wrapper = mount(defineComponent({
      setup() {
        const el = useTemplateRef<HTMLElement>('el');
        const { isVisible } = useIntersectionObserver(el, { threshold: 0.5 });
        visible = () => isVisible.value;
        return () => h('section', { ref: 'el' });
      },
    }));
    await nextTick();
    const io = MockIO.instances[0]!;
    expect(io.observed[0]).toBe(wrapper.get('section').element);
    io.fire(true);
    expect(visible()).toBe(true);
    io.fire(false);
    expect(visible()).toBe(false);
    wrapper.unmount();
    expect(io.disconnected).toBe(true);
  });
});
