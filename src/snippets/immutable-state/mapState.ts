// Map state: copy with `new Map(prev)` then mutate the copy.
export const mapSet = <K, V>(prev: ReadonlyMap<K, V>, key: K, value: V): Map<K, V> =>
  new Map(prev).set(key, value); // set() returns the map, so this is one expression

export function mapDelete<K, V>(prev: ReadonlyMap<K, V>, key: K): ReadonlyMap<K, V> {
  if (!prev.has(key)) return prev; // nothing to do: keep the reference, skip the rerender
  const next = new Map(prev);
  next.delete(key);
  return next;
}

export function mapUpdate<K, V>(
  prev: ReadonlyMap<K, V>,
  key: K,
  fn: (current: V | undefined) => V,
): Map<K, V> {
  return new Map(prev).set(key, fn(prev.get(key)));
}

// Usage (e.g. quantities by product id):
//   const [cart, setCart] = useState<ReadonlyMap<string, number>>(new Map());
//   setCart((prev) => mapUpdate(prev, sku, (n) => (n ?? 0) + 1));
//   setCart((prev) => mapDelete(prev, sku));
// Map/Set state isn't JSON-serialisable: convert before persisting or sending to a server.
