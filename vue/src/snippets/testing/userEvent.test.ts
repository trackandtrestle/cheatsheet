import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref } from 'vue';

const Search = defineComponent({
  emits: { search: (q: string) => typeof q === 'string' },
  setup(_, { emit }) {
    const q = ref('');
    const onInput = (e: Event) => (q.value = (e.target as HTMLInputElement).value);
    return () =>
      h('form', { onSubmit: (e: Event) => { e.preventDefault(); emit('search', q.value); } }, [
        h('input', { 'aria-label': 'Query', value: q.value, onInput }),
        h('button', { type: 'submit' }, 'Go'),
      ]);
  },
});

describe('userEvent', () => {
  it('simulates a real user: focus, keydown, input, keyup, click', async () => {
    const user = userEvent.setup(); // before render; one per test
    const { emitted } = render(Search);
    const input = screen.getByRole('textbox', { name: 'Query' });
    await user.tab(); // focus moves like the browser's Tab key
    expect(input).toHaveFocus();
    await user.keyboard('vuu{Backspace}e'); // special keys in {}
    await user.type(input, '!{Enter}'); // Enter submits the form
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(emitted('search')).toEqual([['vue!'], ['vue!']]);
  });

  it('fireEvent dispatches ONE event — no focus, no keystrokes', async () => {
    render(Search);
    const input = screen.getByRole('textbox', { name: 'Query' });
    await fireEvent.update(input, 'x'); // sets value + fires `input` (await: Vue re-renders)
    expect(input).toHaveValue('x');
    expect(input).not.toHaveFocus(); // a real user would have focused it
  });
});
