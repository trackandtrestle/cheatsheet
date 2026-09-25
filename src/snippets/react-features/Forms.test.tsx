import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ControlledName, UncontrolledName } from './Forms';

describe('controlled vs uncontrolled inputs', () => {
  it('controlled: validates on every keystroke', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ControlledName onSubmit={onSubmit} />);
    const input = screen.getByLabelText('Name');

    await user.type(input, 'Bartholomew');
    expect(input).toBeInvalid();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

    await user.clear(input);
    await user.type(input, 'Bart{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('Bart');
  });

  it('uncontrolled: starts from defaultValue and is read via FormData', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<UncontrolledName onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Name'), ' Lovelace');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith('Ada Lovelace');
  });
});
