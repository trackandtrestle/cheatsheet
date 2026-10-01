import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, onMounted, ref, type PropType } from 'vue';

const Panel = defineComponent({
  props: { load: { type: Function as PropType<() => Promise<string>>, required: true } },
  setup(props) {
    const open = ref(false);
    const data = ref('');
    onMounted(async () => (data.value = await props.load()));
    const toggle = () => (open.value = !open.value);
    return () => h('div', [h('button', { onClick: toggle }, 'Toggle'), open.value && h('p', 'Panel'), h('output', data.value)]);
  },
});

describe('nextTick vs flushPromises', () => {
  it('nextTick: wait for Vue to flush a state change to the DOM', async () => {
    const wrapper = mount(Panel, { props: { load: async () => '' } });
    wrapper.get('button').element.click(); // plain DOM click: nothing awaited for us
    expect(wrapper.find('p').exists()).toBe(false); // DOM updates are batched (async)
    await nextTick();
    expect(wrapper.find('p').exists()).toBe(true);
  });

  it('flushPromises: settle EXTERNAL promises (API, fetch) first', async () => {
    const load = () => Promise.resolve('ada').then((s) => s.toUpperCase()); // 2+ hops
    const wrapper = mount(Panel, { props: { load } });
    await nextTick(); // one tick is not enough for a promise chain…
    expect(wrapper.get('output').text()).toBe('');
    await flushPromises(); // …this drains all resolved promises (macrotask), then render
    expect(wrapper.get('output').text()).toBe('ADA');
  });
});
