import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeyedList, type Item } from './ListKeys';

const initial: Item[] = [
  { id: 'a', label: 'Apples' },
  { id: 'b', label: 'Bread' },
  { id: 'c', label: 'Cheese' },
];

async function typeThenReverse() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Note for Apples'), 'green');
  await user.click(screen.getByRole('button', { name: 'Reverse' }));
}

describe('list keys', () => {
  it('stable id keys: state follows the item', async () => {
    render(<KeyedList initial={initial} />);
    await typeThenReverse();
    expect(screen.getByLabelText('Note for Apples')).toHaveValue('green');
    expect(screen.getAllByRole('textbox')[2]).toHaveValue('green'); // moved to the end
  });

  it('index keys: state stays at the position and lands on the wrong item', async () => {
    render(<KeyedList initial={initial} indexKeys />);
    await typeThenReverse();
    expect(screen.getByLabelText('Note for Apples')).toHaveValue('');
    expect(screen.getByLabelText('Note for Cheese')).toHaveValue('green');
  });
});
