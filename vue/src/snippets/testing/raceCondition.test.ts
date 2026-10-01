import { expect, it } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, onWatcherCleanup, ref, watch, type PropType } from 'vue';

const Results = defineComponent({
  props: {
    query: { type: String, required: true },
    search: { type: Function as PropType<(q: string) => Promise<string>>, required: true },
  },
  setup(props) {
    const text = ref('');
    watch(() => props.query, async (q) => {
      let stale = false;
      onWatcherCleanup(() => (stale = true)); // runs when the query changes again (call before await!)
      const result = await props.search(q);
      if (!stale) text.value = result;
    }, { immediate: true });
    return () => h('output', text.value);
  },
});

it('the latest request wins even if an earlier one resolves last', async () => {
  // One deferred promise per call: the test decides WHEN and in WHAT ORDER they settle.
  const pending = new Map<string, PromiseWithResolvers<string>>();
  const search = (q: string) => { const d = Promise.withResolvers<string>(); pending.set(q, d); return d.promise; };
  const { rerender } = render(Results, { props: { query: 'vu', search } });
  await rerender({ query: 'vue', search });

  pending.get('vue')?.resolve('results for vue');
  await flushPromises();
  expect(screen.getByRole('status')).toHaveTextContent('results for vue');

  pending.get('vu')?.resolve('results for vu'); // late, stale response…
  await flushPromises();
  expect(screen.getByRole('status')).toHaveTextContent('results for vue'); // …ignored
});
