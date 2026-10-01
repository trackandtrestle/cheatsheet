import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KeyedList from './KeyedList.vue';

const initial = [
  { id: 'a', label: 'Apples' },
  { id: 'b', label: 'Bread' },
  { id: 'c', label: 'Cheese' },
];

async function typeThenReverse() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Note for Apples'), 'green');
  await user.click(screen.getByRole('button', { name: 'Reverse' }));
}

describe('v-for keys', () => {
  it('stable id keys: DOM state follows the item', async () => {
    render(KeyedList, { props: { initial } });
    await typeThenReverse();
    expect(screen.getByLabelText('Note for Apples')).toHaveValue('green');
    expect(screen.getAllByRole('textbox')[2]).toHaveValue('green');
  });

  it('index keys: DOM state stays at the position and lands on the wrong item', async () => {
    render(KeyedList, { props: { initial, indexKeys: true } });
    await typeThenReverse();
    expect(screen.getByLabelText('Note for Apples')).toHaveValue('');
    expect(screen.getByLabelText('Note for Cheese')).toHaveValue('green');
  });
});
