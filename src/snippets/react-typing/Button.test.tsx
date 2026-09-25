import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Button, TextInput } from './Button';
import type { TextInputProps } from './Button';

describe('extending native element props', () => {
  it('forwards native props, class names and ref', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} variant="ghost" className="x" aria-label="Save" onClick={onClick} />);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveClass('btn', 'btn-ghost', 'x');
    expect(btn).toHaveAttribute('type', 'button'); // safe default: no accidental submit
    expect(ref.current).toBe(btn);
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('rejects invalid props', () => {
    // @ts-expect-error — not a variant
    void (<Button variant="danger" />);
    // @ts-expect-error — href is not a <button> attribute
    void (<Button href="/home" />);
  });

  it('replaces onChange with a value callback', async () => {
    expectTypeOf<TextInputProps['onChange']>().parameters.toEqualTypeOf<[value: string]>();
    expectTypeOf<TextInputProps>().not.toHaveProperty('ref');
    const onChange = vi.fn();
    render(<TextInput aria-label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'hi');
    expect(onChange).toHaveBeenLastCalledWith('hi');
  });
});
