import { describe, expect, it } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

const Avatar = defineComponent({
  name: 'Avatar', // SFCs infer it from the filename; stubs are named after it
  props: { name: { type: String, required: true } },
  setup: (props) => () => h('img', { alt: props.name, src: `/avatars/${props.name}.png` }),
});
const UserCard = defineComponent({
  props: { name: { type: String, required: true } },
  setup: (props) => () => h('article', [h(Avatar, { name: props.name }), h('h2', props.name)]),
});

describe('mount vs shallowMount', () => {
  it('mount renders the whole tree', () => {
    const wrapper = mount(UserCard, { props: { name: 'ada' } });
    expect(wrapper.find('img').attributes('alt')).toBe('ada'); // find: CSS selector -> DOM
    expect(wrapper.findComponent(Avatar).exists()).toBe(true); // findComponent -> component
  });

  it('shallowMount stubs every child component', () => {
    const wrapper = shallowMount(UserCard, { props: { name: 'ada' } });
    expect(wrapper.find('img').exists()).toBe(false); // Avatar's own DOM is gone…
    expect(wrapper.html()).toContain('<avatar-stub name="ada">'); // …replaced by a stub
    expect(wrapper.findComponent(Avatar).props('name')).toBe('ada'); // props still checkable
  });

  it('setProps re-renders; await it', async () => {
    const wrapper = mount(UserCard, { props: { name: 'ada' } });
    await wrapper.setProps({ name: 'grace' }); // returns nextTick()
    expect(wrapper.get('h2').text()).toBe('grace'); // get = find that throws if missing
    expect(wrapper.getComponent(Avatar).props()).toEqual({ name: 'grace' });
  });
});
