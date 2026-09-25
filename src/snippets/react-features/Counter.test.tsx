import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('useState functional updates', () => {
  it('value updates collapse to one; updater functions stack', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    const count = screen.getByLabelText('count');

    await user.click(screen.getByRole('button', { name: 'stale +3' }));
    expect(count).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: 'updater +3' }));
    expect(count).toHaveTextContent('4');
  });
});
