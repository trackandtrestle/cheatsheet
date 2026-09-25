export interface Item {
  name: string;
  kind: 'fruit' | 'veg';
  price: number;
}

// Object.groupBy (ES2024): string/symbol keys -> Partial<Record<K, T[]>>.
// Groups that never appear are missing, so each value is T[] | undefined.
export function namesByKind(items: Item[]): string[] {
  const groups = Object.groupBy(items, (i) => i.kind);
  return (groups.fruit ?? []).map((i) => i.name);
}

// The result has a NULL prototype: no toString/hasOwnProperty. Use Object.hasOwn.
export const hasKind = (items: Item[], kind: string): boolean =>
  Object.hasOwn(Object.groupBy(items, (i) => i.kind), kind);

// Map.groupBy: any key type (numbers, objects), keeps insertion order.
export function byPriceBand(items: Item[]): Map<number, Item[]> {
  return Map.groupBy(items, (i) => Math.floor(i.price / 10) * 10);
}

// Pre-ES2024 fallback with reduce.
export const groupByReduce = <T, K extends PropertyKey>(xs: T[], key: (x: T) => K) =>
  xs.reduce<Partial<Record<K, T[]>>>((acc, x) => {
    (acc[key(x)] ??= []).push(x);
    return acc;
  }, {});
