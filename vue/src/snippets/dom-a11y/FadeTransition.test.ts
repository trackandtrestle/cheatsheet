import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import FadeTransition from './FadeTransition.vue';

// jsdom has no matchMedia.
function mockReducedMotion(matches: boolean) {
  vi.stubGlobal('matchMedia', (media: string) =>
    ({ matches, media, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as MediaQueryList);
}
afterEach(() => vi.unstubAllGlobals());

const show = ref(true);
const Host = defineComponent(() => () => h('div', h(FadeTransition, null, () => (show.value ? h('p', 'Toast') : null))));
// VTU stubs <Transition> by default (instant); opt out to test the real one.
const mountHost = () => mount(Host, { global: { stubs: { transition: false } } });

describe('FadeTransition', () => {
  afterEach(() => { show.value = true; });

  it('animates the leave normally', async () => {
    mockReducedMotion(false);
    const wrapper = mountHost();
    show.value = false;
    await nextTick();
    expect(wrapper.get('p').classes()).toContain('fade-leave-active'); // still leaving
  });

  it('removes instantly when the user prefers reduced motion', async () => {
    mockReducedMotion(true);
    const wrapper = mountHost();
    show.value = false;
    await nextTick();
    expect(wrapper.find('p').exists()).toBe(false);
  });
});
