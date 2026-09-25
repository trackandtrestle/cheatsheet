import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { QueuedCounter, StaleCounter } from './FunctionalUpdates';

describe('functional state updates', () => {
  it('value updates read stale state: +3 becomes +1', async () => {
    const user = userEvent.setup();
    render(<StaleCounter />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Stale +3: 1');
  });

  it('updater functions chain: +3 is +3', async () => {
    const user = userEvent.setup();
    render(<QueuedCounter />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Functional +3: 6');
  });
});
