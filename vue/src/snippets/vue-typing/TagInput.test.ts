import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import TagInput from './TagInput.vue';

const tagTexts = () => within(screen.getByRole('list', { name: 'Tags' })).queryAllByRole('listitem').map((li) => li.textContent);

describe('typing template event handlers', () => {
  it('reads the input via a narrowed event.target and handles keys', async () => {
    const user = userEvent.setup();
    render(TagInput);
    const input = screen.getByLabelText('Add tag');

    await user.type(input, ' vue {Enter}ts{Enter}vue{Enter}');
    expect(tagTexts()).toEqual(['vue', 'ts']); // trimmed, de-duplicated
    expect(input).toHaveValue('');

    await user.type(input, '{Backspace}');
    expect(tagTexts()).toEqual(['vue']);
  });
});
