import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { useFocusTrap } from './useFocusTrap';

function Dialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [extra, setExtra] = useState(false);
  useFocusTrap(ref, onClose);
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Settings">
      <input aria-label="Name" />
      <button onClick={() => setExtra(true)}>More</button>
      {extra && <button onClick={onClose}>Done</button>}
    </div>
  );
}

function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <Dialog onClose={() => setOpen(false)} />}
    </>
  );
}

describe('useFocusTrap', () => {
  it('wraps Tab, includes late elements, closes on Escape and restores focus', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const name = screen.getByRole('textbox', { name: 'Name' });
    expect(name).toHaveFocus(); // first focusable

    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'More' })).toHaveFocus(); // wrapped backwards
    await user.keyboard('{Enter}'); // adds "Done" dynamically
    await user.tab();
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus();
    await user.tab();
    expect(name).toHaveFocus(); // wrapped forwards past the new last element

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
  });
});
