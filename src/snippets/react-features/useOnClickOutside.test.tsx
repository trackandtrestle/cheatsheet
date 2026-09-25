import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOnClickOutside } from './useOnClickOutside';

function Popover({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClose);
  return (
    <>
      <div ref={ref}><button>Inside</button></div>
      <button>Outside</button>
    </>
  );
}

describe('useOnClickOutside', () => {
  afterEach(() => vi.restoreAllMocks());

  it('fires for pointer and focus outside, not inside', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Popover onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Inside' }));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(onClose).toHaveBeenCalled();

    onClose.mockClear();
    screen.getByRole('button', { name: 'Inside' }).focus();
    await user.tab(); // keyboard focus leaves the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('uses the latest handler without re-subscribing', async () => {
    const add = vi.spyOn(document, 'addEventListener');
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<Popover onClose={first} />);
    const subscriptions = add.mock.calls.length;

    rerender(<Popover onClose={second} />);
    expect(add.mock.calls.length).toBe(subscriptions);

    await userEvent.setup().click(screen.getByRole('button', { name: 'Outside' }));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalled();
  });
});
