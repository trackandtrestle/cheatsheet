import { describe, expect, it } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Shop, useShop, type Product } from './MemoCallback';

const products: Product[] = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
];

describe('useMemo / useCallback', () => {
  it('keeps props referentially stable across unrelated state changes', () => {
    const { result } = renderHook(() => useShop(products));
    const first = result.current;

    act(() => first.add(1)); // cart changes, list inputs do not
    expect(result.current.cart).toEqual([1]);
    expect(result.current.visible).toBe(first.visible);
    expect(result.current.add).toBe(first.add);

    act(() => result.current.setQuery('ban')); // a real dependency changed
    expect(result.current.visible).not.toBe(first.visible);
    expect(result.current.visible.map((p) => p.name)).toEqual(['Banana']);
  });

  it('works end to end', async () => {
    const user = userEvent.setup();
    render(<Shop products={products} />);
    await user.click(screen.getByRole('button', { name: 'Add Apple' }));
    expect(screen.getByText('Cart: 1')).toBeInTheDocument();
  });
});
