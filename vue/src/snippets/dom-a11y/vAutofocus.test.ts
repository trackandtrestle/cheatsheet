import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref, withDirectives } from 'vue';
import { vAutofocus } from './vAutofocus';

const InlineEdit = defineComponent(() => {
  const editing = ref(false);
  return () =>
    editing.value
      ? withDirectives(h('input', { 'aria-label': 'Title' }), [[vAutofocus]]) // v-autofocus
      : h('button', { onClick: () => (editing.value = true) }, 'Edit title');
});

const Search = defineComponent(() => {
  const active = ref(false);
  return () => [
    h('button', { onClick: () => (active.value = true) }, 'Search'),
    withDirectives(h('input', { 'aria-label': 'Query' }), [[vAutofocus, active.value]]),
  ];
});

describe('v-autofocus', () => {
  it('focuses an element inserted later by v-if', async () => {
    const user = userEvent.setup();
    render(InlineEdit);
    await user.click(screen.getByRole('button', { name: 'Edit title' }));
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveFocus();
  });

  it('respects a false binding and focuses when it flips to true', async () => {
    const user = userEvent.setup();
    render(Search);
    expect(screen.getByRole('textbox')).not.toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('textbox', { name: 'Query' })).toHaveFocus();
  });
});
