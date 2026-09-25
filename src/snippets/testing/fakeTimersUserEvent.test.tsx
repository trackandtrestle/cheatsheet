import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

function Toast() {
  const [open, setOpen] = useState(false);
  const show = () => { setOpen(true); setTimeout(() => setOpen(false), 3000); };
  return (<><button onClick={show}>Save</button>{open && <p role="status">Saved</p>}</>);
}

// PITFALL: with plain `vi.useFakeTimers()` every `await user.click()` HANGS.
// user-event (and RTL's asyncWrapper) await a real setTimeout between actions;
// RTL only auto-advances *Jest* fake timers, so under Vitest nobody ticks the clock.
// findBy/waitFor stall the same way — they poll with timers.
describe('fake timers + userEvent', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true })); // clock follows real time
  afterEach(() => vi.useRealTimers());

  it('advances the fake clock for user-event, jumps it explicitly for the app', async () => {
    const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
    render(<Toast />);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Saved');

    act(() => vi.advanceTimersByTime(2000)); // act: the timer causes a state update
    expect(screen.getByRole('status')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000)); // not ms-exact: real time also ticks
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
