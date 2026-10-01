import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import QuantityInput from './QuantityInput.vue';

// v-model="qty" compiles to :modelValue="qty" + @update:modelValue="qty = $event".
// In a test YOU are the parent: pass both props and feed updates back with setProps.
describe('testing v-model / defineModel', () => {
  it('round-trips through the parent', async () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 1,
        max: 2,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    });
    await wrapper.get('[aria-label="Increase"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]]);
    expect(wrapper.props('modelValue')).toBe(2);
    expect(wrapper.get('output').text()).toBe('2');
    expect(wrapper.get('[aria-label="Increase"]').attributes()).toHaveProperty('disabled'); // clamped
  });

  it('is controlled: with a listener, nothing changes until the parent updates the prop', async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(QuantityInput, { props: { modelValue: 1, 'onUpdate:modelValue': onUpdate } });
    await wrapper.get('[aria-label="Decrease"]').trigger('click');
    expect(onUpdate).toHaveBeenCalledWith(0);
    expect(wrapper.get('output').text()).toBe('1'); // parent "ignored" it
  });
});
