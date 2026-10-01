import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, reactive } from 'vue';
import { createContext } from './context';

interface Cart {
  items: string[];
  add: (item: string) => void;
}
const [provideCart, useCart] = createContext<Cart>('Cart');

const AddButton = defineComponent(() => {
  const cart = useCart(); // Cart, no `?.` needed
  return () => h('button', { onClick: () => cart.add('tea') }, `Items: ${cart.items.length}`);
});

const CartProvider = defineComponent((_, { slots }) => {
  const items = reactive<string[]>([]);
  provideCart({ items, add: (item) => items.push(item) });
  return () => slots.default?.();
});

describe('typed provide/inject', () => {
  it('returns a non-nullable T', () => {
    expectTypeOf(useCart).returns.toEqualTypeOf<Cart>();
  });

  it('shares state with any descendant', async () => {
    render(CartProvider, { slots: { default: () => h(AddButton) } });
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Items: 1');
  });

  it('throws a helpful error without a provider', () => {
    expect(() => render(AddButton)).toThrow('useCart() must be used inside a Cart provider');
  });
});
