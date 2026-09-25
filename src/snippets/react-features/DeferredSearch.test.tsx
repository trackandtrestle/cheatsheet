import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeferredSearch } from './DeferredSearch';

const items = ['apple', 'apricot', 'banana', 'cherry'];

describe('useDeferredValue', () => {
  it('input is immediate; the list catches up with the deferred value', async () => {
    const user = userEvent.setup();
    render(<DeferredSearch items={items} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);

    await user.type(screen.getByRole('searchbox'), 'ap');
    expect(screen.getByRole('searchbox')).toHaveValue('ap');

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2));
    expect(screen.getByRole('list').parentElement).toHaveAttribute('aria-busy', 'false');
  });
});
