import { expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, Suspense, type PropType } from 'vue';

// A component with top-level `await` in <script setup> (= async setup) renders NOTHING
// unless an ancestor <Suspense> is waiting for it.
const Profile = defineComponent({
  props: { load: { type: Function as PropType<() => Promise<string>>, required: true } },
  async setup(props) {
    const name = await props.load(); // setup() returns a promise
    return () => h('h1', name);
  },
});

function mountSuspended(load: () => Promise<string>) {
  const Host = defineComponent(() => () =>
    h(Suspense, null, { default: () => h(Profile, { load }), fallback: () => h('p', 'Loading…') }),
  );
  return mount(Host);
}

it('shows the fallback, then the resolved async component', async () => {
  let resolve!: (name: string) => void;
  const wrapper = mountSuspended(() => new Promise((r) => (resolve = r)));
  expect(wrapper.text()).toBe('Loading…');

  resolve('Ada');
  await flushPromises(); // let async setup finish and Suspense swap branches
  expect(wrapper.get('h1').text()).toBe('Ada');
});
