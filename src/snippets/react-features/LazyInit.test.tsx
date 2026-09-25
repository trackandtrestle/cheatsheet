import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DraftList, parseDraft } from './LazyInit';

describe('useState lazy initializer', () => {
  it('runs the initializer once, not on every render', async () => {
    const load = vi.fn(() => '["a","b"]');
    render(<DraftList load={load} />);
    expect(screen.getByText('2 items')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('4 items')).toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('parses defensively', () => {
    expect(parseDraft(null)).toEqual([]);
    expect(parseDraft('{"not":"an array"}')).toEqual([]);
  });
});
