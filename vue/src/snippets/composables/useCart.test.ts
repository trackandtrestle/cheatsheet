import { beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { fireEvent, render, screen } from '@testing-library/vue';
import { resetCart, useCart } from './useCart';

const AddButton = defineComponent({
  setup() {
    const { add } = useCart();
    return () => h('button', { onClick: () => add('tea') }, 'Add tea');
  },
});
const Badge = defineComponent({
  setup() {
    const { count } = useCart();
    return () => h('span', { 'data-testid': 'badge' }, String(count.value));
  },
});

beforeEach(resetCart); // without this the second test would start at 2

describe('useCart (module-level shared state)', () => {
  it('shares one store between sibling components', async () => {
    render(defineComponent({ setup: () => () => [h(AddButton), h(Badge)] }));
    await fireEvent.click(screen.getByRole('button', { name: 'Add tea' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Add tea' }));
    expect(screen.getByTestId('badge')).toHaveTextContent('2');
    expect(useCart().lines.value).toEqual([{ sku: 'tea', qty: 2 }]);
  });

  it('starts empty only because beforeEach reset it', () => {
    const { count, add, remove } = useCart();
    expect(count.value).toBe(0);
    add('a', 3);
    remove('a');
    expect(count.value).toBe(0);
  });
});
