import { describe, expect, it } from 'vitest';
import { byPriceBand, groupByReduce, hasKind, namesByKind, type Item } from './groupBy';

const items: Item[] = [
  { name: 'apple', kind: 'fruit', price: 3 },
  { name: 'kale', kind: 'veg', price: 12 },
  { name: 'pear', kind: 'fruit', price: 15 },
];

describe('Object.groupBy / Map.groupBy', () => {
  it('groups by string key', () => {
    expect(namesByKind(items)).toEqual(['apple', 'pear']);
    expect(namesByKind([])).toEqual([]);
  });
  it('returns a null-prototype object', () => {
    const g = Object.groupBy(items, (i) => i.kind);
    expect(Object.getPrototypeOf(g)).toBeNull();
    expect('hasOwnProperty' in g).toBe(false);
    expect(hasKind(items, 'veg')).toBe(true);
    expect(hasKind(items, 'toString')).toBe(false);
  });
  it('Map.groupBy uses any key type', () => {
    const m = byPriceBand(items);
    expect([...m.keys()]).toEqual([0, 10]);
    expect(m.get(10)?.map((i) => i.name)).toEqual(['kale', 'pear']);
  });
  it('reduce fallback', () => {
    expect(groupByReduce(items, (i) => i.kind).veg?.length).toBe(1);
  });
});
