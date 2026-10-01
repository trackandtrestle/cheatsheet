import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import InlineEdit from './InlineEdit.vue';

describe('custom directive v-focus', () => {
  it('focuses the input as soon as v-if mounts it', async () => {
    const user = userEvent.setup();
    const { emitted } = render(InlineEdit, { props: { modelValue: 'Ada' } });

    await user.click(screen.getByRole('button', { name: /Ada/ }));
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveFocus();

    await user.type(input, '!{Enter}');
    expect(emitted('update:modelValue')).toEqual([['Ada!']]);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
