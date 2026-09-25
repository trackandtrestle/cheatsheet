import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { useCombobox } from './useCombobox';

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Cherry'];

function Fruit() {
  const [value, setValue] = useState('');
  const options = FRUITS.filter((f) => f.toLowerCase().startsWith(value.toLowerCase()));
  const cb = useCombobox(options, setValue);
  return (
    <>
      <label htmlFor="fruit">Fruit</label>
      <input id="fruit" value={value} onChange={(e) => setValue(e.target.value)} {...cb.inputProps} />
      <ul {...cb.listboxProps} aria-label="Fruits">
        {options.map((o, i) => <li key={o} {...cb.getOptionProps(i)}>{o}</li>)}
      </ul>
    </>
  );
}

describe('useCombobox', () => {
  it('moves virtual focus with arrows while DOM focus stays on the input', async () => {
    const user = userEvent.setup();
    render(<Fruit />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await user.type(input, 'ap');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option')).toHaveLength(2);

    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}'); // wraps to the first
    const apple = screen.getByRole('option', { name: 'Apple' });
    expect(input).toHaveAttribute('aria-activedescendant', apple.id);
    expect(apple).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveFocus();

    await user.keyboard('{ArrowUp}{Enter}');
    expect(input).toHaveValue('Apricot');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  it('Escape collapses; clicking an option selects it', async () => {
    const user = userEvent.setup();
    render(<Fruit />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'b{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // hidden -> not in a11y tree
    await user.keyboard('{ArrowDown}');
    await user.click(screen.getByRole('option', { name: 'Banana' }));
    expect(input).toHaveValue('Banana');
    expect(input).toHaveFocus();
  });
});
