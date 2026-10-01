import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import WatchFlush from './WatchFlush.vue';

describe('watch flush timing', () => {
  it('sync fires per mutation, pre before render, post after render', async () => {
    const wrapper = mount(WatchFlush);
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('measured')).toEqual([
      ['sync', 0],
      ['sync', 0],
      ['pre', 0],
      ['post', 2],
    ]);
  });
});
