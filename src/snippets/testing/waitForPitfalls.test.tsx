import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { useEffect, useState } from 'react';

function Profile({ load }: { load: () => Promise<string> }) {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => void load().then(setName), [load]);
  return name ? <h1>{name}</h1> : <p>Loading…</p>;
}

describe('waitFor pitfalls', () => {
  it('prefer findBy over waitFor + getBy', async () => {
    render(<Profile load={() => Promise.resolve('Ada')} />);
    // ✗ await waitFor(() => expect(screen.getByRole('heading')).toBeInTheDocument());
    expect(await screen.findByRole('heading', { name: 'Ada' })).toBeInTheDocument();
  });

  it('one assertion per waitFor; side effects outside the callback', async () => {
    const load = vi.fn(() => Promise.resolve('Grace'));
    render(<Profile load={load} />);
    // ✗ await waitFor(() => { fireEvent.click(btn); expect(...) }) — the callback
    //   re-runs on every poll (every 50 ms + DOM mutations), so the click repeats.
    // ✗ await waitFor(() => {}) — passes on the first tick; waits for nothing.
    await waitFor(() => expect(screen.getByRole('heading')).toHaveTextContent('Grace'));
    // Once the first condition holds, the rest are plain synchronous assertions.
    expect(load).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  it('waitForElementToBeRemoved for disappearance', async () => {
    render(<Profile load={() => Promise.resolve('Linus')} />);
    // The element must exist when you call it, else it throws immediately.
    await waitForElementToBeRemoved(() => screen.queryByText('Loading…'));
    expect(screen.getByRole('heading')).toHaveTextContent('Linus');
  });
});
