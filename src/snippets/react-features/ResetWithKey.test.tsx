import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Profile } from './ResetWithKey';

describe('resetting state with key', () => {
  it('keeps state for the same key and resets it for a new key', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Profile userId="ada" />);
    await user.type(screen.getByRole('textbox'), 'hello');

    rerender(<Profile userId="ada" />);
    expect(screen.getByRole('textbox')).toHaveValue('hello');

    rerender(<Profile userId="grace" />);
    expect(screen.getByRole('textbox', { name: /grace/ })).toHaveValue('');
  });
});
