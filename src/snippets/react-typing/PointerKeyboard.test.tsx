import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MouseEvent } from 'react';
import { Toolbar } from './PointerKeyboard';

describe('keyboard and mouse event types', () => {
  it('handles shortcuts', async () => {
    const onSave = vi.fn();
    render(<Toolbar onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: 'B' }));
    await userEvent.keyboard('{Control>}s{/Control}');
    expect(onSave).toHaveBeenCalledOnce();
  });

  it('distinguishes target from currentTarget', async () => {
    const user = userEvent.setup(); // one instance keeps Shift held between calls
    render(<Toolbar onSave={() => {}} />);
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('button', { name: 'I' }));
    expect(screen.getByRole('status')).toHaveTextContent('italic (shift) in toolbar');
  });

  it('types target loosely and currentTarget precisely', () => {
    type E = MouseEvent<HTMLDivElement>;
    expectTypeOf<E['currentTarget']>().toEqualTypeOf<EventTarget & HTMLDivElement>();
    expectTypeOf<E['target']>().toEqualTypeOf<EventTarget>();
  });
});
