import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FLAGS, track } from './analytics';

// vi.mock is HOISTED above the imports, so the factory can't use top-level variables…
// …unless they are created with vi.hoisted (hoisted too, runs first).
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));

vi.mock('./analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./analytics')>()), // keep real exports…
  track: trackMock, //                                           …replace one
  FLAGS: { newCheckout: true },
}));

function BuyButton() {
  const label = FLAGS.newCheckout ? 'Buy now' : 'Checkout';
  return <button onClick={() => track('buy', { label })}>{label}</button>;
}

describe('vi.mock with factory', () => {
  it('replaces module exports for everything that imports them', async () => {
    render(<BuyButton />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Buy now' }));
    // vi.mocked() only narrows the TYPE to a Mock — no runtime effect.
    expect(vi.mocked(track)).toHaveBeenCalledWith('buy', { label: 'Buy now' });
    expect(trackMock).toBe(track);
  });
});
