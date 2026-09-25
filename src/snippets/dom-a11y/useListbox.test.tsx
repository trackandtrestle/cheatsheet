import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { nextIndex, useListbox } from './useListbox';

const SIZES = ['Small', 'Medium', 'Large', 'XL'] as const;

function SizePicker() {
  const { listboxProps, getOptionProps } = useListbox(SIZES, 'Medium');
  return (
    <ul {...listboxProps} aria-label="Size">
      {SIZES.map((s, i) => <li key={s} {...getOptionProps(i)}>{s}</li>)}
    </ul>
  );
}

describe('listbox keyboard navigation', () => {
  it('nextIndex clamps at the ends', () => {
    expect(nextIndex('ArrowUp', 0, 4)).toBe(0);
    expect(nextIndex('ArrowDown', 3, 4)).toBe(3);
    expect(nextIndex('End', 0, 4)).toBe(3);
    expect(nextIndex('x', 1, 4)).toBeNull();
  });

  it('Arrows, Home/End and type-ahead move the selection', async () => {
    const user = userEvent.setup();
    render(<SizePicker />);
    const listbox = screen.getByRole('listbox', { name: 'Size' });
    const selected = () => screen.getByRole('option', { selected: true });

    await user.tab();
    expect(listbox).toHaveFocus();
    expect(listbox).toHaveAttribute('aria-activedescendant', selected().id);
    await user.keyboard('{ArrowDown}');
    expect(selected()).toHaveTextContent('Large');
    await user.keyboard('{Home}');
    expect(selected()).toHaveTextContent('Small');
    await user.keyboard('{End}');
    expect(selected()).toHaveTextContent('XL');
    await user.keyboard('m');
    expect(selected()).toHaveTextContent('Medium');
  });
});
