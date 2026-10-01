import { afterEach, describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import SearchBox from './SearchBox.vue';

let wrapper: VueWrapper | undefined;
afterEach(() => wrapper?.unmount());

describe('useTemplateRef + defineExpose', () => {
  it('focuses the element ref on mount', () => {
    wrapper = mount(SearchBox, { props: { focusOnMount: true }, attachTo: document.body });
    expect(wrapper.get('input').element).toHaveFocus();
  });

  it('exposes clear() to the parent', async () => {
    const box = mount(SearchBox, { props: { modelValue: 'vue' }, attachTo: document.body });
    wrapper = box;
    box.vm.clear();
    expect(box.emitted('update:modelValue')).toEqual([['']]);
    expect(box.get('input').element).toHaveFocus();
  });

  it('exposes nothing else (component state stays private)', () => {
    wrapper = mount(SearchBox);
    expect(Object.keys(wrapper.vm.$.exposed ?? {})).toEqual(['focus', 'clear']);
  });
});
