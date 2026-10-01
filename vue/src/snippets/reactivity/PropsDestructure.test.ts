import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PropsDestructure from './PropsDestructure.vue';

describe('reactive props destructure', () => {
  it('applies defaults and stays reactive in computed, watch and composables', async () => {
    const wrapper = mount(PropsDestructure);
    expect(wrapper.text()).toBe('Count: 0 × 2 = 0 (even)');

    await wrapper.setProps({ count: 3, label: 'Clicks' });
    expect(wrapper.text()).toBe('Clicks: 3 × 2 = 6 (odd)');
    expect(wrapper.emitted('change')).toEqual([[3, 0]]);
  });
});
