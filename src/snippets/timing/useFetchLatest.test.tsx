import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserName } from './useFetchLatest';

describe('race-safe fetch in useEffect', () => {
  it('a stale response never overwrites a newer one', async () => {
    const requests = new Map<string, PromiseWithResolvers<string>>();
    const signals = new Map<string, AbortSignal>();
    // Deferred loader that ignores the signal, so only the `ignore` flag protects us.
    const load = vi.fn((id: string, signal: AbortSignal) => {
      const d = Promise.withResolvers<string>();
      requests.set(id, d);
      signals.set(id, signal);
      return d.promise;
    });

    const { rerender } = render(<UserName id="1" load={load} />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    rerender(<UserName id="2" load={load} />);
    expect(signals.get('1')?.aborted).toBe(true); // cleanup aborted the old request

    await act(async () => requests.get('2')?.resolve('Grace'));
    expect(screen.getByText('Grace')).toBeInTheDocument();

    await act(async () => requests.get('1')?.resolve('Ada')); // slow, stale response lands last
    expect(screen.getByText('Grace')).toBeInTheDocument();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
  });

  it('shows an error state for the current request', async () => {
    const load = vi.fn(async () => {
      throw new Error('500');
    });
    render(<UserName id="1" load={load} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load user');
  });
});
