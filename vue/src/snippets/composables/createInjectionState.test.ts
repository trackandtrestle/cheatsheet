import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';
import { mount } from '@vue/test-utils';
import { createInjectionState } from './createInjectionState';

const [provideCounter, useCounter] = createInjectionState((start: number) => {
  const count = shallowRef(start);
  return { count, inc: () => count.value++ };
}, 'Counter');

const Child = defineComponent({
  setup() {
    const { count, inc } = useCounter();
    return () => h('button', { onClick: inc }, String(count.value));
  },
});
const Parent = defineComponent({
  props: { start: { type: Number, required: true } },
  setup(props) {
    provideCounter(props.start);
    return () => h('div', [h(Child), h(Child)]);
  },
});

describe('createInjectionState', () => {
  it('shares state within one provider subtree, isolated between providers', async () => {
    const a = mount(Parent, { props: { start: 1 } });
    const b = mount(Parent, { props: { start: 10 } });
    await a.findAll('button')[0]!.trigger('click');
    expect(a.findAll('button').map((w) => w.text())).toEqual(['2', '2']);
    expect(b.findAll('button').map((w) => w.text())).toEqual(['10', '10']);
  });

  it('throws a helpful error without a provider', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {}); // Vue's "unhandled error" warn
    expect(() => mount(Child)).toThrow('Counter: useInject() needs a useProvide() ancestor');
    vi.restoreAllMocks();
  });
});
