import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, onMounted, ref } from 'vue';

//             0 match   1 match   >1 match   async?
// getBy       throw     element   throw      no
// queryBy     null      element   throw      no
// findBy      reject    element   reject     yes (retries up to 1000 ms)
// getAllBy    throw     [el]      [els]      no
// queryAllBy  []        [el]      [els]      no
const Notice = defineComponent(() => {
  const ready = ref(false);
  onMounted(() => setTimeout(() => (ready.value = true), 50));
  return () => (ready.value ? h('p', { role: 'status' }, 'Saved') : h('p', 'Saving…'));
});

describe('getBy vs queryBy vs findBy', () => {
  it('getBy throws, queryBy returns null, findBy waits', async () => {
    render(Notice);
    expect(() => screen.getByRole('status')).toThrow(/unable to find/i);
    expect(screen.queryByRole('status')).not.toBeInTheDocument(); // assert absence
    expect(await screen.findByRole('status')).toHaveTextContent('Saved');
  });

  it('*AllBy returns arrays; getBy throws on multiple matches', () => {
    render(() => h('ul', [h('li', 'a'), h('li', 'b')]));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(() => screen.getByRole('listitem')).toThrow(/multiple elements/i);
    expect(screen.queryAllByRole('row')).toEqual([]);
  });
});
