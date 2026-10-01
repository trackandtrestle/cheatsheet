import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';

const Stepper = defineComponent({
  props: { max: { type: Number, default: 2 } },
  emits: { change: (value: number) => Number.isInteger(value), limit: () => true },
  setup(props, { emit }) {
    const count = ref(0);
    const inc = () => {
      if (count.value === props.max) return emit('limit');
      emit('change', ++count.value);
    };
    return () => h('button', { onClick: inc }, `Count: ${count.value}`);
  },
});

describe('trigger + emitted()', () => {
  it('records every emission as an array of argument lists', async () => {
    const wrapper = mount(Stepper);
    const button = wrapper.get('button');

    await button.trigger('click'); // trigger returns nextTick(): await it before reading DOM
    expect(button.text()).toBe('Count: 1');
    await button.trigger('click');
    await button.trigger('click');

    expect(wrapper.emitted('change')).toEqual([[1], [2]]); // one inner array per emit
    expect(wrapper.emitted('limit')).toHaveLength(1);
    expect(wrapper.emitted()).not.toHaveProperty('reset'); // never emitted -> undefined
  });

  it('or pass an onX prop and assert on a spy', async () => {
    const changes: number[] = [];
    const wrapper = mount(Stepper, { props: { onChange: (v: number) => changes.push(v) } });
    await wrapper.get('button').trigger('click');
    expect(changes).toEqual([1]);
  });
});
