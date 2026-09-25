import { memo, useCallback, useMemo, useState } from 'react';

export interface Product { id: number; name: string }
type ListProps = { products: Product[]; onAdd: (id: number) => void };

// memo() skips re-rendering only if EVERY prop is === to last time.
export const ProductList = memo(function ProductList({ products, onAdd }: ListProps) {
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}><button onClick={() => onAdd(p.id)}>Add {p.name}</button></li>
      ))}
    </ul>
  );
});

export function useShop(products: Product[]) {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<number[]>([]);
  // Without useMemo, filter() returns a new array each render -> memo is useless.
  const visible = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );
  // Without useCallback, a new function each render also defeats memo.
  const add = useCallback((id: number) => setCart((c) => [...c, id]), []);
  return { query, setQuery, visible, cart, add };
}

export function Shop({ products }: { products: Product[] }) {
  const { query, setQuery, visible, cart, add } = useShop(products);
  return (
    <div>
      <input aria-label="Filter" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>Cart: {cart.length}</p>
      <ProductList products={visible} onAdd={add} />
    </div>
  );
}
