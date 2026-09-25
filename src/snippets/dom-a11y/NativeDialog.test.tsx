import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { NativeDialog } from './NativeDialog';

// jsdom has no showModal/close: stub them to exercise *our* wiring.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) { this.open = true; });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  });
});

function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Delete…</button>
      <NativeDialog open={open} onClose={() => setOpen(false)} title="Delete file?">
        <p>This cannot be undone.</p>
      </NativeDialog>
    </>
  );
}

describe('native <dialog>', () => {
  it('opens with showModal and syncs state from the close event', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // closed = not rendered to a11y
    await user.click(screen.getByRole('button', { name: 'Delete…' }));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog', { name: 'Delete file?' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete…' })); // state was reset
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(2);
  });
});
