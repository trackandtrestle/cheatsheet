import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { UserCard, getUser, type User } from './SuspenseUse';

describe('Suspense + use()', () => {
  it('shows the fallback, then the resolved value', async () => {
    const { promise, resolve } = Promise.withResolvers<User>();
    const load = vi.fn(() => promise);

    await act(async () => {
      render(<UserCard userPromise={getUser('u1', load)} />);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');

    await act(async () => resolve({ id: 'u1', name: 'Ada' }));
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('caches the promise per id so re-renders reuse it', () => {
    const load = vi.fn((id: string) => Promise.resolve({ id, name: 'Grace' }));
    const a = getUser('u2', load);
    const b = getUser('u2', load);
    expect(a).toBe(b);
    expect(load).toHaveBeenCalledTimes(1);
  });
});
