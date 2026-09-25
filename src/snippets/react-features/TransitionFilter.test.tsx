import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransitionFilter } from './TransitionFilter';

const items = Array.from({ length: 300 }, (_, i) => `Item ${i + 1}`);

describe('useTransition list filter', () => {
  it('updates the input immediately and the list once the transition commits', async () => {
    const user = userEvent.setup();
    render(<TransitionFilter items={items} />);
    expect(screen.getByRole('status')).toHaveTextContent('300 matches');

    const input = screen.getByRole('searchbox', { name: 'Filter items' });
    await user.type(input, 'item 29');
    expect(input).toHaveValue('item 29');

    // "Item 29" + "Item 290".."Item 299"
    expect(await screen.findByText('11 matches')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(11);
    expect(screen.getByRole('list')).toHaveAttribute('aria-busy', 'false');
  });
});
