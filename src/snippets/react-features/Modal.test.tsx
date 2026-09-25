import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('createPortal', () => {
  it('renders outside the parent DOM node but bubbles React events to React ancestors', async () => {
    const onParentClick = vi.fn();
    const onClose = vi.fn();
    const { container } = render(
      <div onClick={onParentClick}>
        <Modal open title="Settings" onClose={onClose}>Body</Modal>
      </div>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(container).not.toContainElement(dialog);
    expect(dialog.parentElement).toBe(document.body);

    await userEvent.setup().click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onParentClick).toHaveBeenCalledTimes(1); // DOM-wise it's not a descendant!
  });

  it('closes on Escape and renders nothing when closed', async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Modal open title="T" onClose={onClose}>x</Modal>);
    await userEvent.setup().keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<Modal open={false} title="T" onClose={onClose}>x</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
